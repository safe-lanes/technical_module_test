import { Router } from "express";
import { z } from "zod";
import type { IStorage } from "../storage";
import { insertChangeRequestSchema, insertChangeRequestCommentSchema, insertChangeRequestAttachmentSchema } from "@shared/schema";

export default function createChangeRequestsRouter(storage: IStorage) {
  const router = Router();

// Get all change requests with filtering
router.get("/", async (req, res) => {
  try {
    const { vesselId, status, category, requestedBy } = req.query;
    
    let requests = await storage.getChangeRequests({ vesselId: vesselId as string });
    
    // Apply filters
    if (status) {
      requests = requests.filter(r => r.status === status);
    }
    if (category) {
      requests = requests.filter(r => r.category === category);
    }
    if (requestedBy) {
      requests = requests.filter(r => r.requestedByUserId === requestedBy);
    }
    
    // Sort by most recent first
    requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    res.json(requests);
  } catch (error) {
    console.error("Error fetching change requests:", error);
    res.status(500).json({ error: "Failed to fetch change requests" });
  }
});

// Get a specific change request by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const request = await storage.getChangeRequest(id);
    
    if (!request) {
      return res.status(404).json({ error: "Change request not found" });
    }
    
    res.json(request);
  } catch (error) {
    console.error("Error fetching change request:", error);
    res.status(500).json({ error: "Failed to fetch change request" });
  }
});

// Create a new change request
router.post("/", async (req, res) => {
  try {
    const validatedData = insertChangeRequestSchema.parse(req.body);
    
    // Add default values
    const requestData = {
      ...validatedData,
      vesselId: validatedData.vesselId || 'V001',
      status: 'draft' as const,
      requestedByUserId: validatedData.requestedByUserId || 'system'
    };
    
    const newRequest = await storage.createChangeRequest(requestData);
    res.status(201).json(newRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating change request:", error);
    res.status(500).json({ error: "Failed to create change request" });
  }
});

// Update change request status
router.patch("/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, reviewedByUserId, reviewComments } = req.body;
    
    if (!['draft', 'submitted', 'returned', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const updatedRequest = await storage.updateChangeRequest(id, { 
      status, 
      reviewedByUserId, 
      reviewedAt: new Date()
    });
    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating change request status:", error);
    res.status(500).json({ error: "Failed to update change request status" });
  }
});

// Get comments for a change request
router.get("/:id/comments", async (req, res) => {
  try {
    const changeRequestId = parseInt(req.params.id);
    const comments = await storage.getChangeRequestComments(changeRequestId);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add comment to change request
router.post("/:id/comments", async (req, res) => {
  try {
    const changeRequestId = parseInt(req.params.id);
    const commentData = {
      ...req.body,
      changeRequestId
    };
    
    const validatedData = insertChangeRequestCommentSchema.parse(commentData);
    const newComment = await storage.createChangeRequestComment(validatedData);
    res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Get attachments for a change request
router.get("/:id/attachments", async (req, res) => {
  try {
    const changeRequestId = parseInt(req.params.id);
    const attachments = await storage.getChangeRequestAttachments(changeRequestId);
    res.json(attachments);
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
});

// Add attachment to change request
router.post("/:id/attachments", async (req, res) => {
  try {
    const changeRequestId = parseInt(req.params.id);
    const attachmentData = {
      ...req.body,
      changeRequestId
    };
    
    const validatedData = insertChangeRequestAttachmentSchema.parse(attachmentData);
    const newAttachment = await storage.createChangeRequestAttachment(validatedData);
    res.status(201).json(newAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating attachment:", error);
    res.status(500).json({ error: "Failed to create attachment" });
  }
});

  return router;
}