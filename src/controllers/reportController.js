const reportService = require('../services/reportService');

class ReportController {
  async getOverdueLoans(req, res, next) {
    try {
      const overdueLoans = await reportService.getOverdueLoans();
      res.status(200).json({
        success: true,
        count: overdueLoans.length,
        data: overdueLoans,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGeneralMetrics(req, res, next) {
    try {
      const metrics = await reportService.getGeneralMetrics();
      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
