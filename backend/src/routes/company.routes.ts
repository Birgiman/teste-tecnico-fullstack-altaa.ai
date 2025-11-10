import {
  createCompanyController,
  deleteCompanyController,
  getCompanyController,
  listCompaniesController,
  selectActiveCompanyController,
  updateCompanyController,
} from '@/controllers/company.controller.js';
import fp from 'fastify-plugin';

export default fp(
  async function (app) {
    app.get('/companies', listCompaniesController);
    app.get('/company/:id', getCompanyController);

    app.post('/company', createCompanyController);
    app.post('/company/:id/select', selectActiveCompanyController);

    app.put('/company/:id', updateCompanyController);

    app.delete('/company/:id', deleteCompanyController);
  },
  {
    name: 'company-routes',
  },
);
