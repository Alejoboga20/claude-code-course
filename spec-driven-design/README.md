# Spec-Driven Design - SDD

Spec-Driven Design is a workflow where we first write a detailed, structured specification of what the software should do, why it matters, and which constraints shape the implementation. The implementation is then guided by that specification instead of by isolated, one-shot prompts.

The goal is to reduce ambiguity before writing code. A good spec gives the model, the developer, and future reviewers a shared source of truth: the problem, expected behavior, technical boundaries, acceptance criteria, and verification steps.

## SDD Steps

### Planning Phase

1. Describe the problem. Discuss the requirement as a problem to solve, not as a pre-selected solution. Clarify the user need, the current pain point, and the desired outcome.
2. Use Plan Mode. Ask the assistant to reason through the approach before implementation. The plan should identify files, dependencies, risks, and the order of work.
3. Refine the specification. Add concrete rules about the technologies to use, constraints to respect, edge cases to handle, and what should be considered out of scope.
4. Define acceptance criteria. Write observable conditions that prove the feature or fix is complete, such as expected UI behavior, API responses, test results, or performance requirements.

### Execution Phase

5. Generate a Markdown document. Save the spec as a `.md` file so it can be reviewed, versioned, and reused as context during implementation.
6. Execute the plan step by step. Implement in small increments, checking the spec frequently and running tests along the way.
7. Review the changes. Inspect the diff step by step, verify that the implementation matches the spec, and update either the code or the spec if new information appears.
8. Close the loop. Record any decisions, trade-offs, or follow-up tasks so the final state is understandable after the work is done.

## What a Good SDD Document Includes

- Problem statement
- Goals and non-goals
- User flows or expected behavior
- Technical constraints
- Implementation plan
- Acceptance criteria
- Test and verification strategy
- Open questions or risks

SDD does not need to be heavy or bureaucratic. For a small change, the spec can be short. For a larger feature, it becomes a map that keeps the work focused, reviewable, and easier to maintain.
