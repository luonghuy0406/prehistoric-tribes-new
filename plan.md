# Project: Prehistoric Tribes – Complete Reverse Engineering

## Role
Act as a Senior Software Reverse Engineer, Java Analyst, Game Systems Analyst and Narrative Designer.

## Objective
Investigate the original Prehistoric Tribes game using its original JAR file, extracted resources, decompiled Java classes and runtime observations.

The purpose is to reconstruct the original game's knowledge base for designing an independently implemented 2D Web remake with redesigned gameplay.

## Tooling Strategy
- Use REA through MCP for supported reverse-engineering investigations.
- Use JDK and archive tools for JAR inspection and extraction.
- Use CFR or another Java-specific decompiler for Java bytecode.
- Use appropriate tools for images, audio, maps and custom binary resources.
- Do not assume REA supports ordinary Java JAR decompilation.
- Do not modify the original JAR.

## Investigation Phases

### Phase 1: Initial Inspection
Identify:
- JAR metadata and manifest.
- Java entry point.
- Dependencies and libraries.
- All archive entries.
- Unknown file formats.

### Phase 2: Resource Extraction
Extract and catalog:
- Images and sprites.
- Animations.
- Audio and music.
- Maps and levels.
- UI resources.
- Configuration files.
- Custom binary formats.

### Phase 3: Java Analysis
- Decompile Java classes.
- Reconstruct package structure.
- Identify important classes and methods.
- Identify dependencies between systems.
- Reconstruct application architecture.

### Phase 4: Narrative Reconstruction
- Extract all story-related text.
- Identify characters.
- Reconstruct dialogues.
- Identify quests and objectives.
- Reconstruct story progression.
- Identify narrative events and endings.

### Phase 5: Gameplay Reconstruction
Analyze:
- Resource management.
- Population management.
- Building system.
- Hunting and gathering.
- Combat.
- Economy.
- World and map.
- Progression.
- AI and NPC behavior.

### Phase 6: Runtime Validation
- Compare static analysis with observed behavior.
- Validate quest conditions.
- Validate resource calculations.
- Validate character interactions.
- Document unresolved questions.

## Evidence Requirements

For every important finding:
1. Provide source file path.
2. Provide class and method names when applicable.
3. Include relevant resource identifiers.
4. Explain the evidence supporting the conclusion.
5. Assign confidence: Confirmed, Strongly Inferred or Unknown.
6. Never fabricate missing story or gameplay information.

## Documentation Output

Create a structured research repository containing:

01_initial_inspection/
02_assets/
03_code_analysis/
04_narrative/
05_gameplay/
06_runtime_validation/

Generate a master index named PREHISTORIC_TRIBES_RESEARCH.md.

## Important Restrictions
- Work incrementally.
- Do not analyze the entire JAR in one oversized operation.
- Preserve original artifacts.
- Avoid unnecessary modifications to extracted files.
- Do not copy original source code into the new game.
- Distinguish original game facts from redesign proposals.

## Final Objective

Produce a complete, evidence-backed understanding of Prehistoric Tribes and a set of technical and design documents that can be used as the foundation for a new Web-based 2D game.