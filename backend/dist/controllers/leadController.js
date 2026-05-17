"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = exports.getLeads = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const getLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leads = yield Lead_1.default.find();
        res.status(200).json(leads);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching leads",
        });
    }
});
exports.getLeads = getLeads;
const createLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newLead = new Lead_1.default(req.body);
        const savedLead = yield newLead.save();
        res.status(201).json(savedLead);
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating lead",
        });
    }
});
exports.createLead = createLead;
