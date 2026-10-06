import { describe, expect, test } from "vitest";
import {
  canTransition,
  isOrderStatus,
  nextStatuses,
  ORDER_STATUSES,
} from "@/lib/orders";

describe("canTransition", () => {
  test("allows valid forward transitions", () => {
    expect(canTransition("pending", "preparing")).toBe(true);
    expect(canTransition("pending", "cancelled")).toBe(true);
    expect(canTransition("preparing", "ready")).toBe(true);
    expect(canTransition("preparing", "cancelled")).toBe(true);
    expect(canTransition("ready", "delivered")).toBe(true);
  });

  test("rejects invalid or backwards transitions", () => {
    expect(canTransition("pending", "ready")).toBe(false);
    expect(canTransition("pending", "delivered")).toBe(false);
    expect(canTransition("preparing", "pending")).toBe(false);
    expect(canTransition("preparing", "delivered")).toBe(false);
    expect(canTransition("ready", "pending")).toBe(false);
    expect(canTransition("ready", "preparing")).toBe(false);
    expect(canTransition("ready", "cancelled")).toBe(false);
    expect(canTransition("delivered", "pending")).toBe(false);
    expect(canTransition("delivered", "preparing")).toBe(false);
    expect(canTransition("delivered", "ready")).toBe(false);
    expect(canTransition("delivered", "cancelled")).toBe(false);
    expect(canTransition("cancelled", "pending")).toBe(false);
    expect(canTransition("cancelled", "preparing")).toBe(false);
    expect(canTransition("cancelled", "ready")).toBe(false);
    expect(canTransition("cancelled", "delivered")).toBe(false);
  });
});

describe("nextStatuses", () => {
  test("returns correct next statuses for workflow", () => {
    expect(nextStatuses("pending")).toEqual(["preparing", "cancelled"]);
    expect(nextStatuses("preparing")).toEqual(["ready", "cancelled"]);
    expect(nextStatuses("ready")).toEqual(["delivered"]);
    expect(nextStatuses("delivered")).toEqual([]);
    expect(nextStatuses("cancelled")).toEqual([]);
  });
});

describe("isOrderStatus", () => {
  test("accepts valid statuses", () => {
    for (const s of ORDER_STATUSES) {
      expect(isOrderStatus(s)).toBe(true);
    }
  });

  test("rejects invalid values", () => {
    for (const bad of ["shipped", "PENDING", "", "unknown", 123, null, undefined, {}]) {
      expect(isOrderStatus(bad)).toBe(false);
    }
  });
});
