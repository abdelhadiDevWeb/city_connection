import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import {
  ResidenceModel,
  BuildingModel,
  ApartmentModel,
  ResidentProfileModel,
} from '@saas/database';
import {
  CreateResidenceSchema,
  CreateBuildingSchema,
  CreateApartmentSchema,
  CreateResidentSchema,
} from '@saas/validation';

export const residenceRoutes = new Elysia({ prefix: '/api/v1/residences' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // ----------------------------------------------------
  // RESIDENCES CRUD
  // ----------------------------------------------------

  // List all residences for active organization
  .get('/', async ({ authUser }) => {
    const orgId = authUser.activeOrgId;
    const filter = orgId ? { organizationId: orgId, status: 'ACTIVE' } : { status: 'ACTIVE' };
    const residences = await ResidenceModel.find(filter).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: residences.map((r: any) => ({
        id: r._id.toString(),
        name: r.name,
        code: r.code,
        typeName: r.typeName || 'Copropriété',
        wilaya: r.wilaya,
        commune: r.commune,
        address: r.address,
        totalBuildings: r.totalBuildings || 0,
        totalApartments: r.totalApartments || 0,
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  })

  // Get single residence details with buildings & apartments counts
  .get('/:id', async ({ authUser, params, set }) => {
    const residence = await ResidenceModel.findById(params.id).lean();
    if (!residence) {
      set.status = 404;
      return { success: false, error: { code: 'NOT_FOUND', message: 'Residence not found' } };
    }

    const [buildings, apartments] = await Promise.all([
      BuildingModel.find({ residenceId: params.id, status: 'ACTIVE' }).lean(),
      ApartmentModel.find({ residenceId: params.id }).lean(),
    ]);

    const occupiedCount = apartments.filter((a: any) => a.occupancyStatus === 'OCCUPIED').length;
    const totalUnpaid = apartments.reduce((sum: number, a: any) => {
      const bal = Number(a.currentBalance) || 0;
      return bal < 0 ? sum + Math.abs(bal) : sum;
    }, 0);

    return {
      success: true,
      data: {
        id: (residence as any)._id.toString(),
        name: (residence as any).name,
        code: (residence as any).code,
        typeName: (residence as any).typeName,
        wilaya: (residence as any).wilaya,
        commune: (residence as any).commune,
        address: (residence as any).address,
        totalBuildings: (residence as any).totalBuildings,
        totalApartments: (residence as any).totalApartments,
        status: (residence as any).status,
        buildingsCount: buildings.length,
        apartmentsCount: apartments.length,
        occupiedApartmentsCount: occupiedCount,
        totalUnpaidDebt: totalUnpaid,
        createdAt: (residence as any).createdAt,
      },
    };
  })

  // Create new residence
  .post('/', async ({ authUser, body, set }) => {
    const parsed = CreateResidenceSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const data = parsed.data;
    const code = (data.code || data.name.substring(0, 4)).toUpperCase();

    const residence = await ResidenceModel.create({
      organizationId: authUser.activeOrgId,
      name: data.name,
      code,
      typeId: data.typeId,
      typeName: data.typeName || 'Copropriété',
      wilaya: data.wilaya,
      commune: data.commune,
      address: data.address,
      totalBuildings: data.totalBuildings,
      totalApartments: data.totalApartments,
      notes: data.notes,
      status: 'ACTIVE',
    });

    return {
      success: true,
      data: {
        id: residence._id.toString(),
        name: residence.name,
        code: residence.code,
      },
    };
  })

  // ----------------------------------------------------
  // BUILDINGS
  // ----------------------------------------------------

  // List buildings for a residence
  .get('/:id/buildings', async ({ params }) => {
    const buildings: any[] = await BuildingModel.find({
      residenceId: params.id,
      status: 'ACTIVE',
    })
      .sort({ name: 1 })
      .lean();

    // Fetch apartment stats per building
    const apartments = await ApartmentModel.find({ residenceId: params.id }).lean();

    const enriched = buildings.map((b) => {
      const bApts = apartments.filter((a: any) => String(a.buildingId) === String(b._id));
      const occupied = bApts.filter((a: any) => a.occupancyStatus === 'OCCUPIED').length;
      const unpaid = bApts.reduce((sum: number, a: any) => {
        const bal = Number(a.currentBalance) || 0;
        return bal < 0 ? sum + Math.abs(bal) : sum;
      }, 0);

      return {
        id: b._id.toString(),
        residenceId: b.residenceId.toString(),
        name: b.name,
        floorsCount: b.floorsCount,
        apartmentsCount: b.apartmentsCount,
        occupiedApartments: occupied,
        totalUnpaidAmount: unpaid,
        status: b.status,
      };
    });

    return {
      success: true,
      data: enriched,
    };
  })

  // Add building to residence
  .post('/:id/buildings', async ({ authUser, params, body, set }) => {
    const parsed = CreateBuildingSchema.safeParse({ ...(body as any), residenceId: params.id });
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const building = await BuildingModel.create({
      organizationId: authUser.activeOrgId,
      residenceId: params.id,
      name: parsed.data.name,
      floorsCount: parsed.data.floorsCount,
      apartmentsCount: parsed.data.apartmentsCount,
      description: parsed.data.description,
      status: 'ACTIVE',
    });

    return {
      success: true,
      data: {
        id: building._id.toString(),
        name: building.name,
        residenceId: building.residenceId.toString(),
      },
    };
  })

  // ----------------------------------------------------
  // APARTMENTS
  // ----------------------------------------------------

  // List apartments in residence (supports optional ?buildingId= query)
  .get('/:id/apartments', async ({ params, query }) => {
    const filter: any = { residenceId: params.id };
    if (query?.buildingId) {
      filter.buildingId = query.buildingId;
    }

    const apartments: any[] = await ApartmentModel.find(filter)
      .populate('buildingId', 'name')
      .populate('currentResidentId', 'fullName phone residentType')
      .sort({ number: 1 })
      .lean();

    return {
      success: true,
      data: apartments.map((a) => ({
        id: a._id.toString(),
        residenceId: a.residenceId.toString(),
        buildingId: a.buildingId?._id?.toString() || String(a.buildingId),
        buildingName: a.buildingId?.name || '',
        number: a.number,
        floor: a.floor,
        type: a.type,
        surfaceM2: a.surfaceM2,
        occupancyStatus: a.occupancyStatus,
        currentResidentId: a.currentResidentId?._id?.toString(),
        currentResidentName: a.currentResidentId?.fullName,
        currentResidentPhone: a.currentResidentId?.phone,
        monthlyChargeAmount: a.monthlyChargeAmount,
        currentBalance: a.currentBalance,
      })),
    };
  })

  // Add apartment
  .post('/:id/apartments', async ({ authUser, params, body, set }) => {
    const parsed = CreateApartmentSchema.safeParse({ ...(body as any), residenceId: params.id });
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const apartment = await ApartmentModel.create({
      organizationId: authUser.activeOrgId,
      residenceId: params.id,
      buildingId: parsed.data.buildingId,
      number: parsed.data.number,
      floor: parsed.data.floor,
      type: parsed.data.type,
      surfaceM2: parsed.data.surfaceM2,
      occupancyStatus: parsed.data.occupancyStatus,
      monthlyChargeAmount: parsed.data.monthlyChargeAmount,
      currentBalance: parsed.data.initialBalance || 0,
    });

    return {
      success: true,
      data: {
        id: apartment._id.toString(),
        number: apartment.number,
        buildingId: apartment.buildingId.toString(),
      },
    };
  })

  // ----------------------------------------------------
  // RESIDENTS
  // ----------------------------------------------------

  // List residents for a residence
  .get('/:id/residents', async ({ params }) => {
    const residents: any[] = await ResidentProfileModel.find({
      residenceId: params.id,
      status: 'ACTIVE',
    })
      .populate('buildingId', 'name')
      .populate('apartmentId', 'number floor currentBalance monthlyChargeAmount')
      .sort({ fullName: 1 })
      .lean();

    return {
      success: true,
      data: residents.map((r) => ({
        id: r._id.toString(),
        residenceId: r.residenceId.toString(),
        buildingId: r.buildingId?._id?.toString(),
        buildingName: r.buildingId?.name,
        apartmentId: r.apartmentId?._id?.toString(),
        apartmentNumber: r.apartmentId?.number,
        apartmentBalance: r.apartmentId?.currentBalance || 0,
        fullName: r.fullName,
        phone: r.phone,
        email: r.email,
        residentType: r.residentType,
        occupancyStartDate: r.occupancyStartDate,
        status: r.status,
      })),
    };
  })

  // Register resident to an apartment
  .post('/:id/residents', async ({ authUser, params, body, set }) => {
    const parsed = CreateResidentSchema.safeParse({ ...(body as any), residenceId: params.id });
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const resident = await ResidentProfileModel.create({
      organizationId: authUser.activeOrgId,
      residenceId: params.id,
      buildingId: parsed.data.buildingId,
      apartmentId: parsed.data.apartmentId,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      residentType: parsed.data.residentType,
      occupancyStartDate: parsed.data.occupancyStartDate,
      notes: parsed.data.notes,
      status: 'ACTIVE',
    });

    // Update apartment occupancy and link
    await ApartmentModel.findByIdAndUpdate(parsed.data.apartmentId, {
      occupancyStatus: 'OCCUPIED',
      currentResidentId: resident._id,
    });

    return {
      success: true,
      data: {
        id: resident._id.toString(),
        fullName: resident.fullName,
        apartmentId: resident.apartmentId.toString(),
      },
    };
  });
