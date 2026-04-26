import { z } from 'zod'

const BlockTypeEnum = z.enum(['static', 'dynamic'])
const ComponentEntrySchema = z.object({ registryName: z.string(), }).passthrough()
const RequestSchema = z.object({
	fileType: z.enum(['edit', 'save']),
	blockType: BlockTypeEnum,
	blockConfig: z.unknown(),
	components: z.array(ComponentEntrySchema),
})

const modelPrompt = (
	data: z.infer<typeof RequestSchema>,
) => {
	const blockConfigJson = JSON.stringify(data.blockConfig ?? null, null, 2)
	const componentListJson = JSON.stringify(data.components, null, 2)

	if (data.fileType === 'edit') { // edit.js
		return `You are generating the edit.js source file for a WordPress Block Editor block.
	
	## Goal
	Produce a complete, valid edit module for @wordpress/blocks: the React component passed as the \`edit\` property of registerBlockType (this project imports it as \`import Edit from './edit'\`, so use a default export for the Edit component). Use JSX, WordPress packages indicated by each component's registryPackage, and apiVersion 3 patterns.
	
	## Block configuration
	The following JSON matches block.json–oriented fields from the composer (name, title, description, category, icon, keywords, textdomain, apiVersion, version, render, parent, ancestor, allowedBlocks, supports, attributes). Use it for InspectorControls, toolbar behavior, and attribute keys/types. If attributes are defined, bind controls with setAttributes and match types.
	
	## Block save mode
	blockType is "${data.blockType}". For dynamic blocks the editor UI is unchanged; do not add PHP. For static blocks, keep editor preview consistent with typical static patterns.
	
	## Component tree
	The following JSON is a flat list of selected editor UI components. Fields include id, registryName, label, parentId, order, options, attributeValue, attributeType, registryPackage. Interpret parentId and order as a tree: render roots in order, nest children under their parent. Import each registryName from its registryPackage. Map components to the correct context (main edit area vs InspectorControls vs BlockControls) per WordPress conventions.
	
	## Requirements
	- ES module imports; include @wordpress/block-editor / @wordpress/components / @wordpress/blocks / @wordpress/element as needed.
	- Default export: the main Edit function or component receiving { attributes, setAttributes } from the block editor.
	- Destructure all attributes defined in blockConfig into edit.js, e.g. const {myValue,myAlternateValue} = attributes;
	- Use those values throughout the edit.js e.g. value={myTest}
	- Use useBlockProps on the outer wrapper where appropriate.
	- No placeholders: working JSX. If InnerBlocks appears, respect options (orientation, templateLock, etc.).
	- Output ONLY the JavaScript/JSX source. No markdown code fences, no explanation before or after the code. Return the code as a string, not wrapped in a markdown code fence. NO BACKTICKS.
	
	## blockType
	${data.blockType}
	
	## blockConfig (JSON)
	${blockConfigJson}
	
	## components (JSON)
	${componentListJson}`
	}

	else { // save.js/render.php

		if (data.blockType === 'dynamic') {
			return `You are generating the render.php source file for a WordPress dynamic block.

## Goal
Produce a complete, valid PHP template for a WordPress dynamic block. This file is used as the server-side render callback for registerBlockType. The PHP template receives block attributes and should output the rendered HTML markup.

## What render.php must do
- The template has access to \`$attributes\` (array of block attributes), \`$content\` (string of inner blocks content), and \`$block\` (WP_Block instance).
- Use \`get_block_wrapper_attributes()\` to generate the wrapper attributes for the root element (this includes class names and other block supports).
- Escape all dynamic output using WordPress escaping functions: \`esc_attr()\`, \`esc_html()\`, \`esc_url()\`, \`wp_kses_post()\`, etc.
- Access attributes using the \`$attributes\` array. Check for existence with isset() or empty() before using.
- For RichText content stored in attributes, output the escaped content directly.
- For InnerBlocks content, use the \`$content\` variable which contains the rendered inner blocks markup.
- Match the DOM structure implied by the component tree (parentId, order): same nesting order as edit.js so front-end markup aligns with the editor preview.
- No WordPress hooks, no editor-only logic. Pure PHP template that renders markup.
- DO NOT RENDER HTML INSIDE PHP TAGS. Always enter the PHP variables and logic inside declared HTML. For example: 
  - Instead of: <?php echo '<div class="my-class">'; ?>
  - Use: <div class="my-class">
    <?php echo $myVariable; ?>
  </div>
- Assign hyphenatedclass names based off the attribute names for each component. For example: myTextVal1 receives a class of my-text-val-1.

## Block configuration
The following JSON matches block.json–oriented fields (name, title, description, category, icon, keywords, textdomain, apiVersion, version, render, parent, ancestor, allowedBlocks, supports, attributes). Use attribute definitions to render the appropriate markup.

## Component tree
The following JSON is a flat list of selected components used to build the block. Fields include id, registryName, label, parentId, order, options, attributeValue, attributeType, registryPackage. Interpret parentId and order as a tree. Map each node to its rendered PHP equivalent.

## Requirements
- Output ONLY the PHP source code. No markdown code fences, no explanation before or after the code.
- Use proper PHP opening tag: <?php at the start.
- Do not include a closing PHP tag at the end.
- Return the code as a plain string, not wrapped in a markdown code fence. NO BACKTICKS.

## blockType
${data.blockType}

## blockConfig (JSON)
${blockConfigJson}

## components (JSON)
${componentListJson}`
		}

		return `You are generating the save.js source file for a WordPress Block Editor block.

## Goal
Produce a complete, valid save module for @wordpress/blocks: the React component passed as the \`save\` property of registerBlockType (this project imports it as \`import Save from './save'\`, so use a default export for the Save component). Use JSX, WordPress packages indicated by each component's registryPackage, and apiVersion 3 patterns.

## What save.js must do (differs from edit.js)
- Save runs on the server during serialization and in the frontend when saving the post. It must output static markup only: no hooks that only exist in the editor, no InspectorControls, BlockControls, or interactive editor-only components.
- The Save component receives only \`{ attributes }\` from the block editor. Do not use \`setAttributes\`.
- Wrap the outer element with \`useBlockProps.save()\` from \`@wordpress/block-editor\` (spread onto the root JSX element).
- Destructure every attribute key defined in blockConfig.attributes (if any) from \`attributes\` and use them in the saved markup (e.g. RichText.Content, URLs in tags, class names). If there are no custom attributes, omit unused destructuring.
- For \`RichText\` in the editor tree, use \`RichText.Content\` in save with the same tagName/valueKey pattern as the editor implementation.
- For blocks that use \`InnerBlocks\` in the editor, include \`<InnerBlocks.Content />\` in the saved output in the correct place in the DOM tree so serialized inner blocks persist.
- Match the DOM structure implied by the component tree (parentId, order): same nesting order as edit for static blocks so front-end markup aligns with the editor preview.
- No placeholders: working JSX. Output must be valid for the block type below.

## Block configuration
The following JSON matches block.json–oriented fields (name, title, description, category, icon, keywords, textdomain, apiVersion, version, render, parent, ancestor, allowedBlocks, supports, attributes). Use attribute definitions for RichText.Content and saved markup.

## Component tree
The following JSON is a flat list of selected components used to build the block. Fields include id, registryName, label, parentId, order, options, attributeValue, attributeType, registryPackage. Interpret parentId and order as a tree. For save.js, map each node to its **serialized** counterpart: skip editor-only wrappers; keep structural elements, RichText.Content, InnerBlocks.Content, Media placeholders (e.g. img src from attributes), etc. Import each registryName from its registryPackage only where the save side needs that symbol.

## Requirements
- ES module imports; include @wordpress/block-editor / @wordpress/blocks / @wordpress/element as needed; add @wordpress/block-editor RichText when using RichText.Content.
- Default export: the Save function or component receiving \`{ attributes }\`.
- Output ONLY the JavaScript/JSX source. No markdown code fences, no explanation before or after the code. Return the code as a string, not wrapped in a markdown code fence. NO BACKTICKS.

## blockType
${data.blockType}

## blockConfig (JSON)
${blockConfigJson}

## components (JSON)
${componentListJson}`
	}

}

export { modelPrompt, RequestSchema }