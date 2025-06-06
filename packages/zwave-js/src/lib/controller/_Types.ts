import type { DeviceID } from "@zwave-js/config";
import type { RFRegion } from "@zwave-js/core";
import type { Expand } from "@zwave-js/shared";

export type RebuildRoutesStatus = "pending" | "done" | "failed" | "skipped";

export interface RebuildRoutesOptions {
	/** Whether the routes of sleeping nodes should be rebuilt too at the end of the process. Default: true */
	includeSleeping?: boolean;
	/** Whether nodes with priority return routes should be included, as those will be deleted. Default: false */
	deletePriorityReturnRoutes?: boolean;
}

export type SDKVersion =
	| `${number}.${number}`
	| `${number}.${number}.${number}`;

export interface FirmwareUpdateFileInfo {
	target: number;
	url: string;
	integrity: `sha256:${string}`;
}

/** The information sent to the firmware update service to identify which updates are available for a device. */
export type FirmwareUpdateDeviceID = Expand<
	DeviceID & {
		firmwareVersion: string;
		rfRegion?: RFRegion;
	}
>;

export interface FirmwareUpdateServiceResponse {
	version: string;
	changelog: string;
	channel: "stable" | "beta";
	files: FirmwareUpdateFileInfo[];
	downgrade: boolean;
	normalizedVersion: string;
}

export type FirmwareUpdateInfo = Expand<
	FirmwareUpdateServiceResponse & {
		/** Which device this update is for */
		device: FirmwareUpdateDeviceID;
	}
>;

export interface GetFirmwareUpdatesOptions {
	/** Allows overriding the API key for the firmware update service */
	apiKey?: string;
	/** Allows adding new components to the user agent sent to the firmware update service (existing components cannot be overwritten) */
	additionalUserAgentComponents?: Record<string, string>;
	/** Whether the returned firmware upgrades should include prereleases from the `"beta"` channel. Default: `false`. */
	includePrereleases?: boolean;
	/**
	 * Can be used to specify the RF region if the Z-Wave controller
	 * does not support querying this information.
	 *
	 * **WARNING:** Specifying the wrong region may result in bricking the device!
	 *
	 * For this reason, the specified value is only used as a fallback
	 * if the RF region of the controller is not already known.
	 */
	rfRegion?: RFRegion;
}
