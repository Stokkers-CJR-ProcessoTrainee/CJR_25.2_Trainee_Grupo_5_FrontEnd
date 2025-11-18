import { IconifyIcon } from '@iconify/types';
import { IconifyJSON } from '@iconify/types';
import { IconifyTransformations } from '@iconify/types';
import type { JSX as JSX_2 } from 'react';
import type { ReactNode } from 'react';
import type { SVGProps } from 'react';

/**
 * Add custom config for provider
 */
export declare function addAPIProvider(provider: string, customConfig: PartialIconifyAPIConfig): boolean;

/**
 * Add icon set
 */
export declare function addCollection(data: IconifyJSON, provider?: string): boolean;

/**
 * Add one icon
 */
export declare function addIcon(name: string, data: IconifyIcon | null): boolean;

/**
 * Internal API
 */
export declare const _api: IconifyAPIInternalFunctions;

/**
 * Get SVG attributes and content from icon + customisations
 *
 * Does not generate style to make it compatible with frameworks that use objects for style, such as React.
 * Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
 *
 * Customisations should be normalised by platform specific parser.
 * Result should be converted to <svg> by platform specific parser.
 * Use replaceIDs to generate unique IDs for body.
 */
export declare function buildIcon(icon: IconifyIcon, customisations?: IconifyIconCustomisations_2): IconifyIconBuildResult;

/**
 * Calculate second dimension when only 1 dimension is set
 */
export declare function calculateSize(size: string, ratio: number, precision?: number): string;

export declare function calculateSize(size: number, ratio: number, precision?: number): number;

export declare function calculateSize(size: string | number, ratio: number, precision?: number): string | number;

/**
 * Signature for getAPIConfig
 */
export declare type GetAPIConfig = (provider: string) => IconifyAPIConfig | undefined;

/**
 * Get full icon
 */
export declare function getIcon(name: string): Required<IconifyIcon> | null | undefined;

/**
 * Block icon
 *
 * @param props - Component properties
 */
export declare const Icon: IconComponentType;

declare type IconComponentType = (props: IconProps) => JSX_2.Element;

/**
 * API config
 */
export declare interface IconifyAPIConfig extends RedundancyConfig {
    path: string;
    maxURL: number;
}

export declare interface IconifyAPICustomQueryParams {
    type: 'custom';
    provider?: string;
    uri: string;
}

/**
 * Iconify API functions
 */
export declare interface IconifyAPIFunctions {
    /**
     * Load icons
     */
    loadIcons: (icons: (IconifyIconName | string)[], callback?: IconifyIconLoaderCallback) => IconifyIconLoaderAbort;
    /**
     * Load one icon, using Promise syntax
     */
    loadIcon: (icon: IconifyIconName | string) => Promise<Required<IconifyIcon>>;
    /**
     * Add API provider
     */
    addAPIProvider: (provider: string, customConfig: PartialIconifyAPIConfig) => boolean;
    /**
     * Set custom loader for multple icons
     */
    setCustomIconsLoader: (callback: IconifyCustomIconsLoader, prefix: string, provider?: string) => void;
    /**
     * Set custom loader for one icon
     */
    setCustomIconLoader: (callback: IconifyCustomIconLoader, prefix: string, provider?: string) => void;
}

/**
 * Params for sendQuery()
 */
declare interface IconifyAPIIconsQueryParams {
    type: 'icons';
    provider: string;
    prefix: string;
    icons: string[];
}

/**
 * Exposed internal functions
 *
 * Used by plug-ins, such as Icon Finder
 *
 * Important: any changes published in a release must be backwards compatible.
 */
export declare interface IconifyAPIInternalFunctions {
    /**
     * Get API config, used by custom modules
     */
    getAPIConfig: GetAPIConfig;
    /**
     * Set custom API module
     */
    setAPIModule: (provider: string, item: IconifyAPIModule) => void;
    /**
     * Send API query
     */
    sendAPIQuery: (target: string | PartialIconifyAPIConfig, query: IconifyAPIQueryParams, callback: QueryDoneCallback) => QueryAbortCallback;
    /**
     * Set and get fetch()
     */
    setFetch: (item: typeof fetch) => void;
    getFetch: () => typeof fetch | undefined;
    /**
     * List all API providers (from config)
     */
    listAPIProviders: () => string[];
}

/**
 * API modules
 */
export declare interface IconifyAPIModule {
    prepare: IconifyAPIPrepareIconsQuery;
    send: IconifyAPISendQuery;
}

/**
 * Functions to implement in module
 */
export declare type IconifyAPIPrepareIconsQuery = (provider: string, prefix: string, icons: string[]) => IconifyAPIIconsQueryParams[];

export declare type IconifyAPIQueryParams = IconifyAPIIconsQueryParams | IconifyAPICustomQueryParams;

export declare type IconifyAPISendQuery = (host: string, params: IconifyAPIQueryParams, callback: QueryModuleResponse) => void;

/**
 * Interface for exported builder functions
 */
export declare interface IconifyBuilderFunctions {
    replaceIDs?: (body: string, prefix?: string | (() => string)) => string;
    calculateSize: (size: string | number, ratio: number, precision?: number) => string | number;
    buildIcon: (icon: IconifyIcon, customisations?: IconifyIconCustomisations_2) => IconifyIconBuildResult;
}

/**
 * Custom loader for one icon
 */
export declare type IconifyCustomIconLoader = (name: string, prefix: string, provider: string) => Promise<IconifyIcon | null> | IconifyIcon | null;

/**
 * Custom icons loader
 */
export declare type IconifyCustomIconsLoader = (icons: string[], prefix: string, provider: string) => Promise<IconifyJSON | null> | IconifyJSON | null;

/**
 * React component properties: generic element for Icon component, SVG for generated component
 */
declare type IconifyElementProps = SVGProps<SVGSVGElement>;

export { IconifyIcon }

/**
 * Interface for getSVGData() result
 */
export declare interface IconifyIconBuildResult {
    attributes: {
        width?: string;
        height?: string;
        viewBox: string;
    };
    viewBox: SVGViewBox;
    body: string;
}

/**
 * Icon customisation properties
 *
 * Extends the base Iconify icon customisations with React-specific options.
 * These properties control the appearance and behavior of the icon.
 */
export declare type IconifyIconCustomisations = IconifyIconCustomisations_2 & {
    /**
     * Rotation angle for the icon
     *
     * Can be specified as:
     * - String with units: "90deg", "0.5turn", "1.5708rad"
     * - Number representing quarter-turns: 0=0°, 1=90°, 2=180°, 3=270°
     *
     * @example
     * ```tsx
     * <Icon icon="bi:check2-circle" /> // No rotation
     * <Icon icon="bi:check2-circle" rotate="90deg" /> // 90° clockwise
     * <Icon icon="bi:check2-circle" rotate={2} /> // 180° rotation
     * <Icon icon="bi:check2-circle" rotate="0.5turn" /> // 180° rotation
     * ```
     *
     * @see https://iconify.design/docs/icon-components/react/transform.html#rotation
     */
    rotate?: string | number;
    /**
     * Display mode for the icon
     *
     * When `true`, the icon is displayed as an inline element with baseline
     * vertical alignment. When `false`, it's displayed as a block element
     * with middle vertical alignment.
     *
     * @default false
     *
     * @example
     * ```tsx
     * <Icon icon="mdi:home" inline /> // Aligns with text baseline
     * <Icon icon="mdi:home" /> // Centers vertically
     * ```
     *
     * @see https://iconify.design/docs/icon-components/react/inline.html
     */
    inline?: boolean;
};

/**
 * Icon customisations
 */
declare interface IconifyIconCustomisations_2 extends IconifyTransformations, IconifyIconSizeCustomisations {}

/**
 * Function to abort loading (usually just removes callback because loading is already in progress)
 */
export declare type IconifyIconLoaderAbort = () => void;

/**
 * Loader callback
 *
 * Provides list of icons that have been loaded
 */
export declare type IconifyIconLoaderCallback = (loaded: IconifyIconName[], missing: IconifyIconName[], pending: IconifyIconName[], unsubscribe: IconifyIconLoaderAbort) => void;

/**
 * Icon name
 */
export declare interface IconifyIconName {
    readonly provider: string;
    readonly prefix: string;
    readonly name: string;
}

/**
 * Callback function invoked when icon data has been loaded from the API
 *
 * @param name - The name of the icon that was loaded (e.g., "mdi:home")
 */
export declare type IconifyIconOnLoad = (name: string) => void;

/**
 * Icon properties
 */
export declare interface IconifyIconProps extends IconifyIconCustomisations {
    /**
     * The icon to render
     *
     * Can be either:
     * - An icon object (IconifyIcon) containing SVG data
     * - A string with icon name in format "prefix:name" (must be loaded first)
     *
     * @see https://iconify.design/docs/icon-components/react/#icon
     */
    icon: IconifyIcon | string;
    /**
     * Rendering mode for the icon
     * @see {@link IconifyRenderMode}
     */
    mode?: IconifyRenderMode;
    /**
     * Icon color (for monotone icons only)
     *
     * Only affects monotone icons. Icons with hardcoded palettes (like emoji)
     * cannot be recolored. Accepts any valid CSS color value.
     *
     * @see https://iconify.design/docs/icon-components/react/color.html
     */
    color?: string;
    /**
     * Flip transformation shorthand
     *
     * Convenient way to flip icons horizontally and/or vertically.
     *
     * @example
     * flip="horizontal"
     * flip="vertical"
     * flip="horizontal,vertical"
     *
     * @see https://iconify.design/docs/icon-components/react/transform.html#flip
     */
    flip?: string;
    /**
     * Unique identifier for the icon
     *
     * Used as base for generating unique IDs for SVG elements and shapes.
     * Ensures consistent IDs for server-side rendering and accessibility.
     */
    id?: string;
    /**
     * Server-side rendering mode
     *
     * When `true`, icon renders immediately without waiting for component
     * to mount. Useful for server-side rendering to prevent hydration issues.
     */
    ssr?: boolean;
    /**
     * Fallback content while icon is loading or failed to load
     *
     * Displayed before the icon is loaded and rendered. If not provided,
     * an empty span will be rendered as placeholder.
     */
    fallback?: ReactNode;
    /**
     * Callback fired when icon data is loaded
     *
     * Only triggered for icons loaded from the Iconify API. Not called
     * for icons that are already available or provided as objects.
     */
    onLoad?: IconifyIconOnLoad;
}

/**
 * Icon size
 */
export declare type IconifyIconSize = null | string | number;

/**
 * Dimensions
 */
declare interface IconifyIconSizeCustomisations {
    width?: IconifyIconSize;
    height?: IconifyIconSize;
}

export { IconifyJSON }

/**
 * Function to load icons
 */
declare type IconifyLoadIcons = (icons: (IconifyIconName | string)[], callback?: IconifyIconLoaderCallback) => IconifyIconLoaderAbort;

/**
 * Icon rendering mode
 *
 * Defines how the icon should be rendered in the DOM.
 *
 * - `'svg'` - Render as SVG element (recommended, best compatibility)
 * - `'style'` - Auto-detect between 'bg' or 'mask' based on icon content
 * - `'bg'` - Render as `<span>` with `background-image` CSS property
 * - `'mask'` - Render as `<span>` with `mask-image` CSS property
 *
 * @see https://iconify.design/docs/icon-components/react/render-modes.html
 */
export declare type IconifyRenderMode = 'style' | 'bg' | 'mask' | 'svg';

/**
 * Interface for exported storage functions
 */
export declare interface IconifyStorageFunctions {
    /**
     * Check if icon data is available
     */
    iconLoaded: (name: string) => boolean;
    /**
     * Get icon data with all properties
     *
     * Returns null if icon is missing (attempted to load, but failed)
     * Returns undefined if icon was not loaded
     */
    getIcon: (name: string) => Required<IconifyIcon> | null | undefined;
    /**
     * List all available icons
     */
    listIcons: (provider?: string, prefix?: string) => string[];
    /**
     * Add icon to storage
     *
     * Data is null if icon is missing
     */
    addIcon: (name: string, data: IconifyIcon | null) => boolean;
    /**
     * Add icon set to storage
     */
    addCollection: (data: IconifyJSON, provider?: string) => boolean;
}

/**
 * Check if icon data is available
 */
export declare function iconLoaded(name: string): boolean;

/**
 * Mix of icon properties and SVGSVGElement properties
 */
export declare type IconProps = IconifyElementProps & IconifyIconProps;

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export declare const InlineIcon: IconComponentType;

/**
 * List available icons
 */
export declare function listIcons(provider?: string, prefix?: string): string[];

/**
 * Load one icon using Promise
 */
export declare const loadIcon: (icon: IconifyIconName | string) => Promise<Required<IconifyIcon>>;

/**
 * Load icons
 */
export declare const loadIcons: IconifyLoadIcons;

export declare type PartialIconifyAPIConfig = Partial<IconifyAPIConfig> & Pick<IconifyAPIConfig, 'resources'>;

/**
 * Callback for "abort" pending item.
 */
declare type QueryAbortCallback = () => void;

/**
 * Callback
 *
 * If error is present, something went wrong and data is undefined. If error is undefined, data is set.
 */
declare type QueryDoneCallback = (data?: QueryModuleResponseData, error?: QueryModuleResponseData) => void;

declare type QueryModuleResponse = (status: QueryModuleResponseType, data: QueryModuleResponseData) => void;

/**
 * Response from query module
 */
declare type QueryModuleResponseData = unknown;

/**
 * Response from query module
 */
declare type QueryModuleResponseType = 'success' | 'next' | 'abort';

/**
 * Configuration object
 */
declare interface RedundancyConfig {
    resources: RedundancyResource[];
    index: number;
    timeout: number;
    rotate: number;
    random: boolean;
    dataAfterTimeout: boolean;
}

/**
 * Resource to rotate (usually hostname or partial URL)
 */
declare type RedundancyResource = string;

/**
 * IDs usage:
 *
 * id="{id}"
 * xlink:href="#{id}"
 * url(#{id})
 *
 * From SVG animations:
 *
 * begin="0;{id}.end"
 * begin="{id}.end"
 * begin="{id}.click"
 */
/**
 * Replace IDs in SVG output with unique IDs
 */
export declare function replaceIDs(body: string, prefix?: string | ((id: string) => string)): string;

/**
 * Set custom loader for one icon
 */
export declare function setCustomIconLoader(loader: IconifyCustomIconLoader, prefix: string, provider?: string): void;

/**
 * Set custom loader for multiple icons
 */
export declare function setCustomIconsLoader(loader: IconifyCustomIconsLoader, prefix: string, provider?: string): void;

/**
 * SVG viewBox: x, y, width, height
 */
declare type SVGViewBox = [x: number, y: number, width: number, height: number];

export { }
