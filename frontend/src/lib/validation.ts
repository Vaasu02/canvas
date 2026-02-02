import type { ValidationResult } from '../types';

export function validatePhysics(openSCADCode: string): ValidationResult {

  // Basic checks based on code patterns
  const hasThinWalls = /cube\(\[\d+,\s*\d+,\s*[01]\.\d+\]/.test(openSCADCode);
  const hasComplexOverhangs = /rotate\(\[90,\s*0,\s*0\]/.test(openSCADCode);

  const wallThickness = hasThinWalls ? 1.0 : 2.0;
  const maxOverhang = hasComplexOverhangs ? 90 : 30;

  return {
    centerOfGravity: {
      x: 0,
      y: 0,
      stable: true, 
    },
    wallThickness: {
      min: wallThickness,
      ok: wallThickness >= 1.5,
    },
    overhangAngle: {
      max: maxOverhang,
      ok: maxOverhang <= 45,
    },
  };
}
