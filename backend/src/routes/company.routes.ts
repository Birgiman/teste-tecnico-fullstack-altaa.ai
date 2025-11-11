import {
  createCompanyController,
  deleteCompanyController,
  getCompanyController,
  listCompaniesController,
  removeMemberController,
  selectActiveCompanyController,
  updateCompanyController,
  updateMemberRoleController,
} from '@/controllers/company.controller.js';
import {
  authorizeOwner,
  authorizeOwnerOrAdmin,
} from '@/middlewares/authorize.middleware.js';
import fp from 'fastify-plugin';

export default fp(
  async function (app) {
    app.get('/companies', listCompaniesController);

    app.post('/company', createCompanyController);

    app.get('/company/:id', getCompanyController);

    app.post('/company/:id/select', selectActiveCompanyController);

    app.put(
      '/company/:id',
      { preHandler: [authorizeOwnerOrAdmin()] },
      updateCompanyController,
    );

    app.delete(
      '/company/:id',
      { preHandler: [authorizeOwner()] },
      deleteCompanyController,
    );

    app.delete(
      '/company/:id/members/:userId',
      { preHandler: [authorizeOwnerOrAdmin()] },
      removeMemberController,
    );

    app.patch(
      '/company/:id/members/:userId',
      { preHandler: [authorizeOwner()] },
      updateMemberRoleController,
    );
  },
  {
    name: 'company-routes',
  },
);
