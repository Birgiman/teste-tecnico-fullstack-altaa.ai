import {
  createCompanyController,
  deleteCompanyController,
  getCompanyController,
  listCompaniesController,
  updateCompanyController,
} from '@/controllers/company.controller.js';
import fp from 'fastify-plugin';

export default fp(
  async function (app) {
    app.get('/companies', listCompaniesController);
    app.post('/company', createCompanyController);
    app.get('/company/:id', getCompanyController);
    app.put('/company/:id', updateCompanyController);
    app.delete('/company/:id', deleteCompanyController);
  },
  {
    name: 'company-routes',
  },
);
