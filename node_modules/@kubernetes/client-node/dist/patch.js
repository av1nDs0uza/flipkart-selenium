"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchStrategy = void 0;
/**
 * Valid Content-Type header values for patch operations.  See
 * https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/
 * for details.
 */
var PatchStrategy;
(function (PatchStrategy) {
    /** Diff-like JSON format. */
    PatchStrategy["JsonPatch"] = "application/json-patch+json";
    /** Simple merge. */
    PatchStrategy["MergePatch"] = "application/merge-patch+json";
    /** Merge with different strategies depending on field metadata. */
    PatchStrategy["StrategicMergePatch"] = "application/strategic-merge-patch+json";
})(PatchStrategy || (exports.PatchStrategy = PatchStrategy = {}));
//# sourceMappingURL=patch.js.map