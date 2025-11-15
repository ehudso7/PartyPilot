"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planner_controller_1 = require("./planner.controller");
const router = (0, express_1.Router)();
router.post('/plan', planner_controller_1.planTrip);
exports.default = router;
