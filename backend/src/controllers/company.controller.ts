import {
  companyIdSchema,
  createCompanySchema,
  listCompaniesSchema,
  selectActiveCompanySchema,
  updateCompanySchema,
} from '@/schemas/company.schema.js';
import {
  createCompanyService,
  deleteCompanyService,
  getCompanyService,
  listCompaniesService,
  selectActiveCompanyService,
  updateCompanyService,
} from '@/services/company.service.js';
import { Reply, Req } from '@/types/fastify.types.js';

export const createCompanyController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const data = createCompanySchema.parse(req.body);

  const company = await createCompanyService(userId, data);

  return res.status(201).send({
    success: true,
    message: 'Empresa criada com sucesso',
    data: company,
  });
};

export const listCompaniesController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const { page, limit } = listCompaniesSchema.parse(req.query);

  const result = await listCompaniesService(userId, page, limit);

  return res.status(200).send({
    success: true,
    data: result,
  });
};

export const getCompanyController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const { id } = companyIdSchema.parse(req.params);

  const company = await getCompanyService(userId, id);

  return res.status(200).send({
    success: true,
    data: company,
  });
};

export const updateCompanyController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const { id } = companyIdSchema.parse(req.params);
  const data = updateCompanySchema.parse(req.body);

  const company = await updateCompanyService(userId, id, data);

  return res.status(200).send({
    success: true,
    message: 'Empresa atualizada com sucesso',
    data: company,
  });
};

export const deleteCompanyController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const { id } = companyIdSchema.parse(req.params);

  await deleteCompanyService(userId, id);

  return res.status(200).send({
    success: true,
    message: 'Empresa deletada com sucesso',
  });
};

export const selectActiveCompanyController = async (req: Req, res: Reply) => {
  const userId = req.user!.userId;
  const { id } = selectActiveCompanySchema.parse(req.params);

  const result = await selectActiveCompanyService(userId, id);

  return res.status(200).send({
    success: true,
    message: result.message,
    data: {
      activeCompanyId: result.activeCompanyId,
    },
  });
};
