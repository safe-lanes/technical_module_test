import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertAlertPolicySchema, insertAlertConfigSchema } from "@shared/schema";

const router = Router();

// Get all alert policies
router.get("/policies", async (req, res) => {
  try {
    const policies = await storage.getAlertPolicies();
    res.json(policies);
  } catch (error) {
    console.error("Error fetching alert policies:", error);
    res.status(500).json({ error: "Failed to fetch alert policies" });
  }
});

// Get single alert policy
router.get("/policies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const policy = await storage.getAlertPolicy(id);
    if (!policy) {
      return res.status(404).json({ error: "Alert policy not found" });
    }
    res.json(policy);
  } catch (error) {
    console.error("Error fetching alert policy:", error);
    res.status(500).json({ error: "Failed to fetch alert policy" });
  }
});

// Update alert policy
router.patch("/policies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const policy = await storage.updateAlertPolicy(id, req.body);
    res.json(policy);
  } catch (error) {
    console.error("Error updating alert policy:", error);
    res.status(500).json({ error: "Failed to update alert policy" });
  }
});

// Batch update alert policies
router.post("/policies/batch-update", async (req, res) => {
  try {
    const updates = req.body.policies;
    const results = [];
    
    for (const update of updates) {
      const policy = await storage.updateAlertPolicy(update.id, update);
      results.push(policy);
    }
    
    res.json({ success: true, policies: results });
  } catch (error) {
    console.error("Error batch updating alert policies:", error);
    res.status(500).json({ error: "Failed to batch update alert policies" });
  }
});

// Get alert events (history)
router.get("/events", async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      alertType: req.query.alertType as string | undefined,
      priority: req.query.priority as string | undefined,
      status: req.query.status as string | undefined,
      vesselId: req.query.vesselId as string | undefined,
    };
    
    const events = await storage.getAlertEvents(filters);
    res.json(events);
  } catch (error) {
    console.error("Error fetching alert events:", error);
    res.status(500).json({ error: "Failed to fetch alert events" });
  }
});

// Get alert event details
router.get("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await storage.getAlertEvent(id);
    if (!event) {
      return res.status(404).json({ error: "Alert event not found" });
    }
    
    // Also get deliveries for this event
    const deliveries = await storage.getAlertDeliveries(id);
    
    res.json({ ...event, deliveries });
  } catch (error) {
    console.error("Error fetching alert event:", error);
    res.status(500).json({ error: "Failed to fetch alert event" });
  }
});

// Acknowledge alert event
router.post("/events/:id/acknowledge", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.body.userId || "user1"; // In production, get from session
    const event = await storage.acknowledgeAlertEvent(id, userId);
    res.json(event);
  } catch (error) {
    console.error("Error acknowledging alert event:", error);
    res.status(500).json({ error: "Failed to acknowledge alert event" });
  }
});

// Send test alert
router.post("/test", async (req, res) => {
  try {
    const { policyId, userId } = req.body;
    
    // Get the policy
    const policy = await storage.getAlertPolicy(policyId);
    if (!policy) {
      return res.status(404).json({ error: "Alert policy not found" });
    }
    
    // Create a test event
    const event = await storage.createAlertEvent({
      policyId,
      alertType: policy.alertType,
      priority: policy.priority,
      objectType: 'test',
      objectId: 'test-' + Date.now(),
      vesselId: 'V001',
      dedupeKey: `test-${policyId}-${Date.now()}`,
      state: 'test',
      payload: JSON.stringify({
        test: true,
        message: `This is a test alert for ${policy.alertType}`,
        timestamp: new Date().toISOString()
      })
    });
    
    // Create test deliveries
    if (policy.inAppEnabled) {
      await storage.createAlertDelivery({
        eventId: event.id,
        channel: 'in_app',
        recipient: userId || 'user1',
        status: 'sent'
      });
    }
    
    if (policy.emailEnabled) {
      await storage.createAlertDelivery({
        eventId: event.id,
        channel: 'email',
        recipient: userId || 'user1@example.com',
        status: 'sent'
      });
    }
    
    res.json({ success: true, event });
  } catch (error) {
    console.error("Error sending test alert:", error);
    res.status(500).json({ error: "Failed to send test alert" });
  }
});

// Get alert configuration
router.get("/config/:vesselId", async (req, res) => {
  try {
    const config = await storage.getAlertConfig(req.params.vesselId);
    res.json(config || {
      vesselId: req.params.vesselId,
      quietHoursEnabled: false,
      quietHoursStart: null,
      quietHoursEnd: null,
      escalationEnabled: false,
      escalationHours: 4,
      escalationRecipients: '[]'
    });
  } catch (error) {
    console.error("Error fetching alert config:", error);
    res.status(500).json({ error: "Failed to fetch alert config" });
  }
});

// Update alert configuration
router.post("/config", async (req, res) => {
  try {
    const config = await storage.createOrUpdateAlertConfig({
      ...req.body,
      updatedBy: req.body.userId || 'user1'
    });
    res.json(config);
  } catch (error) {
    console.error("Error updating alert config:", error);
    res.status(500).json({ error: "Failed to update alert config" });
  }
});

export default router;