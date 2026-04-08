import { z } from 'zod'

const alignValues = ['left', 'center', 'right', 'wide', 'full'] as const
const spacingSides = ['top', 'right', 'bottom', 'left', 'vertical', 'horizontal'] as const

export const BlockSupportsSchema = z.object({
  anchor: z.boolean().default(false),
  align: z.union([
    z.boolean(),
    z.array(z.enum(alignValues)),
  ]).default(false),
  alignWide: z.boolean().default(true),
  className: z.boolean().default(true),
  customClassName: z.boolean().default(true),
  html: z.boolean().default(true),
  inserter: z.boolean().default(true),
  multiple: z.boolean().default(true),
  reusable: z.boolean().default(true),
  lock: z.boolean().default(true),
  renaming: z.boolean().default(true),
  splitting: z.boolean().default(false),
  color: z.object({
    text: z.boolean().default(true),
    background: z.boolean().default(true),
    link: z.boolean().default(false),
    gradients: z.boolean().default(false),
    heading: z.boolean().default(false),
    button: z.boolean().default(false),
  }).optional(),
  typography: z.object({
    fontSize: z.boolean().default(false),
    lineHeight: z.boolean().default(false),
    textAlign: z.boolean().default(false),
  }).optional(),
  spacing: z.object({
    margin: z.union([z.boolean(), z.array(z.enum(spacingSides))]).default(false),
    padding: z.union([z.boolean(), z.array(z.enum(spacingSides))]).default(false),
  }).optional(),
  dimensions: z.object({
    minHeight: z.boolean().default(false),
    aspectRatio: z.boolean().default(false),
  }).optional(),
  border: z.object({
    radius: z.boolean().default(false),
    color: z.boolean().default(false),
    width: z.boolean().default(false),
    style: z.boolean().default(false),
  }).optional(),
  layout: z.union([
    z.boolean(),
    z.object({
      allowSwitching: z.boolean().default(false),
      allowInheriting: z.boolean().default(true),
      allowVerticalAlignment: z.boolean().default(true),
      allowJustification: z.boolean().default(true),
      allowOrientation: z.boolean().default(true),
      default: z.object({
        type: z.enum(['constrained', 'flex', 'grid']).optional(),
      }).optional(),
    }),
  ]).default(false),
  position: z.object({
    sticky: z.boolean().default(false),
  }).optional(),
})

export const BlockOptionsSchema = z.object({
  name: z.string()
    .min(1, 'Block name is required')
    .regex(/^[a-z0-9-]+\/[a-z0-9-]+$/, 'Must be namespace/block-name (e.g. my-plugin/my-block)'),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(400).optional().default(''),
  category: z.enum(['text', 'media', 'design', 'widgets', 'theme', 'embed']).default('text'),
  icon: z.string().optional().default(''),
  keywords: z.array(z.string()).max(3, 'WordPress recommends a maximum of 3 keywords').optional().default([]),
  textdomain: z.string().optional().default(''),
  apiVersion: z.number().int().min(1).max(3).default(3),
  version: z.string().optional().default('0.1.0'),
  render: z.string().optional().nullable(),
  parent: z.array(z.string()).optional().default([]),
  ancestor: z.array(z.string()).optional().default([]),
  allowedBlocks: z.array(z.string()).optional().default([]),
  supports: BlockSupportsSchema.optional(),
	attributes: z.array(z.string()).optional().default([]),
})

export type BlockSupportsSchema = z.output<typeof BlockSupportsSchema>
export type BlockOptionsSchema = z.output<typeof BlockOptionsSchema>
