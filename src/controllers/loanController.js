const loanService = require('../services/loanService');

class LoanController {
  async createLoan(req, res, next) {
    try {
      const loan = await loanService.createLoan(req.body, req.user || { id: req.body.userId, role: 'APRENDIZ' });
      res.status(201).json({
        success: true,
        message: 'Solicitud de préstamo procesada exitosamente.',
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoans(req, res, next) {
    try {
      const loans = await loanService.getLoans(req.query);
      res.status(200).json({
        success: true,
        count: loans.length,
        data: loans,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanById(req, res, next) {
    try {
      const loan = await loanService.getLoanById(req.params.id);
      res.status(200).json({
        success: true,
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  async approveLoan(req, res, next) {
    try {
      const loan = await loanService.approveLoan(req.params.id, req.user || { id: req.body.approvedById });
      res.status(200).json({
        success: true,
        message: 'Préstamo aprobado satisfactoriamente.',
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }

  async returnLoan(req, res, next) {
    try {
      const loan = await loanService.returnLoan(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Devolución registrada correctamente.',
        data: loan,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LoanController();
