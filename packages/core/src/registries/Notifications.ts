import { num2hex } from "@zwave-js/shared";

interface NotificationDefinition {
	readonly name: string;
	readonly variables?: readonly NotificationVariableDefinition[];
	readonly events?: Readonly<Record<number, NotificationEventDefinition>>;
}

export interface Notification {
	readonly type: number;
	readonly name: string;
	readonly variables: readonly NotificationVariable[];
	readonly events: ReadonlyMap<number, NotificationEvent>;
}

export interface NotificationValueBase {
	readonly label: string;
	readonly description?: string;
	readonly parameter?: NotificationParameter;
	readonly idleVariables?: readonly number[];
}

/** The representation of a NotificationState in the definition object */
type NotificationStateDefinition = NotificationValueBase;

export interface NotificationState extends NotificationValueBase {
	readonly type: "state";
	readonly variableName: string;
	/** Whether the variable may be reset to idle */
	readonly idle: boolean;
	readonly value: number;
}

type NotificationEventDefinition = NotificationValueBase;

export interface NotificationEvent extends NotificationValueBase {
	readonly type: "event";
	readonly value: number;
}

export type NotificationValue =
	| NotificationState
	| NotificationEvent;

/** The representation of a NotificationVariable in the definition object */
interface NotificationVariableDefinition {
	readonly name: string;
	/** Whether the variable may be reset to idle */
	readonly idle?: boolean;
	readonly states: Record<number, NotificationStateDefinition>;
}

/** A group of notification states with different values that refer to the same logical variable */
export interface NotificationVariable {
	readonly name: string;
	/** Whether the variable may be reset to idle */
	readonly idle: boolean;
	readonly states: ReadonlyMap<number, NotificationState>;
}

/** Marks a notification that contains a duration */
export interface NotificationParameterWithDuration {
	readonly type: "duration";
}

/** Marks a notification that contains a CC */
export interface NotificationParameterWithCommandClass {
	readonly type: "commandclass";
}

/** Marks a notification that contains a named value */
export interface NotificationParameterWithValue {
	readonly type: "value";
	readonly propertyName: string;
}

/** Marks a notification that contains an enumeration of values */
export interface NotificationParameterWithEnum {
	readonly type: "enum";
	readonly values: Record<number, string>;
	readonly default?: number;
}

export type NotificationParameter =
	| NotificationParameterWithDuration
	| NotificationParameterWithCommandClass
	| NotificationParameterWithValue
	| NotificationParameterWithEnum;

const notifications = Object.freeze(
	{
		[0x01]: {
			name: "Smoke Alarm",
			variables: [
				{
					name: "Sensor status",
					states: {
						[0x01]: {
							label: "Smoke detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Smoke detected",
						},
					},
				},
				{
					name: "Alarm status",
					states: {
						[0x03]: {
							label: "Smoke alarm test",
						},
						[0x06]: {
							label: "Alarm silenced",
							description:
								"This event may be issued by an alarm device to advertise that the alarm has been silenced by a local user event.",
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x04]: {
							label: "Replacement required",
							description:
								"This event may be issued by an alarm device to advertise that its physical components are no more reliable, e.g. because of clogged filters.",
						},
						[0x05]: {
							label: "Replacement required, End-of-life",
							description:
								"This event may be issued by an alarm device to advertise that the device has reached the end of its designed lifetime. The device should no longer be used.",
						},
					},
				},
				{
					name: "Periodic inspection status",
					states: {
						[0x07]: {
							label:
								"Maintenance required, planned periodic inspection",
							description:
								"This event may be issued by an alarm device to advertise that the device has reached the end of a designed maintenance interval. The device is should be serviced in order to stay reliable.",
						},
					},
				},
				{
					name: "Dust in device status",
					states: {
						[0x08]: {
							label: "Maintenance required, dust in device",
							description:
								"This event may be issued by an alarm device to advertise that the device has detected dust in its sensor. The device is not reliable until it has been serviced.",
						},
					},
				},
			],
		},
		[0x02]: {
			name: "CO Alarm",
			variables: [
				{
					name: "Sensor status",
					states: {
						[0x01]: {
							label:
								"Carbon monoxide detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Carbon monoxide detected",
						},
					},
				},
				{
					name: "Test status",
					idle: false,
					states: {
						[0x03]: {
							label: "Carbon monoxide test",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Test OK",
									[0x02]: "Test failed",
								},
							},
							description:
								"The Carbon monoxide Test event may be issued by an alarm device to advertise that the test mode of the device has been activated. The activation may be manual or via signaling.\nA receiving application SHOULD NOT activate any alarms in response to this event.",
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x04]: {
							label: "Replacement required",
							description:
								"This event may be issued by an alarm device to advertise that its physical components are no more reliable, e.g. because of clogged filters.",
						},
						[0x05]: {
							label: "Replacement required, End-of-life",
							description:
								"This event may be issued by an alarm device to advertise that the device has reached the end of its designed lifetime. The device should no longer be used.",
						},
					},
				},
				{
					name: "Alarm status",
					states: {
						[0x06]: {
							label: "Alarm silenced",
						},
					},
				},
				{
					name: "Periodic inspection status",
					states: {
						[0x07]: {
							label:
								"Maintenance required, planned periodic inspection",
						},
					},
				},
			],
		},
		[0x03]: {
			name: "CO2 Alarm",
			variables: [
				{
					name: "Sensor status",
					states: {
						[0x01]: {
							label:
								"Carbon dioxide detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Carbon dioxide detected",
						},
					},
				},
				{
					name: "Test status",
					idle: false,
					states: {
						[0x03]: {
							label: "Carbon dioxide test",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Test OK",
									[0x02]: "Test failed",
								},
							},
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x04]: {
							label: "Replacement required",
							description:
								"This event may be issued by an alarm device to advertise that its physical components are no more reliable, e.g. because of clogged filters.",
						},
						[0x05]: {
							label: "Replacement required, End-of-life",
							description:
								"This event may be issued by an alarm device to advertise that the device has reached the end of its designed lifetime. The device should no longer be used.",
						},
					},
				},
				{
					name: "Alarm status",
					states: {
						[0x06]: {
							label: "Alarm silenced",
						},
					},
				},
				{
					name: "Periodic inspection status",
					states: {
						[0x07]: {
							label:
								"Maintenance required, planned periodic inspection",
						},
					},
				},
			],
		},
		[0x04]: {
			name: "Heat Alarm",
			variables: [
				{
					name: "Heat sensor status",
					states: {
						[0x01]: {
							label: "Overheat detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Overheat detected",
						},
						[0x05]: {
							label: "Underheat detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x06]: {
							label: "Underheat detected",
						},
					},
				},
				{
					name: "Alarm status",
					states: {
						[0x07]: {
							label: "Heat alarm test",
							description:
								"This event may be issued by an alarm device to advertise that the local test function has been activated.",
						},
						[0x09]: {
							label: "Alarm silenced",
							description:
								"This event may be issued by an alarm device to advertise that the alarm has been silenced by a local user event.",
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x08]: {
							label: "Replacement required, End-of-life",
							description:
								"This event may be issued by an alarm device to advertise that the device has reached the end of its designed lifetime. The device should no longer be used.",
						},
					},
				},
				{
					name: "Periodic inspection status",
					states: {
						[0x0b]: {
							label:
								"Maintenance required, planned periodic inspection",
							description:
								"This event may be issued by an alarm device to advertise that the device has reached the end of a designed maintenance interval. The device is should be serviced in order to stay reliable.",
						},
					},
				},
				{
					name: "Dust in device status",
					states: {
						[0x0a]: {
							label: "Maintenance required, dust in device",
							description:
								"This event may be issued by an alarm device to advertise that the device has detected dust in its sensor. The device is not reliable until it has been serviced.",
						},
					},
				},
			],
			events: {
				[0x03]: {
					label: "Rapid temperature rise (location provided)",
					description:
						"The event parameters contain a location report",
				},
				[0x04]: {
					label: "Rapid temperature rise",
				},
				[0x0c]: {
					label: "Rapid temperature fall (location provided)",
					description:
						"The event parameters contain a location report",
				},
				[0x0d]: {
					label: "Rapid temperature fall",
				},
			},
		},
		[0x05]: {
			name: "Water Alarm",
			variables: [
				{
					name: "Sensor status",
					states: {
						[0x01]: {
							label: "Water leak detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Water leak detected",
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x05]: {
							label: "Replace water filter",
						},
					},
				},
				{
					name: "Water flow alarm status",
					states: {
						[0x06]: {
							label: "Water flow alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "No data",
									[0x02]: "Below low threshold",
									[0x03]: "Above high threshold",
									[0x04]: "Max",
								},
								// Translate missing event parameter to "no data"
								default: 0x01,
							},
						},
					},
				},
				{
					name: "Water pressure alarm status",
					states: {
						[0x07]: {
							label: "Water pressure alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "No data",
									[0x02]: "Below low threshold",
									[0x03]: "Above high threshold",
									[0x04]: "Max",
								},
								// Translate missing event parameter to "no data"
								default: 0x01,
							},
						},
					},
				},
				{
					name: "Water temperature alarm status",
					states: {
						[0x08]: {
							label: "Water temperature alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "No data",
									[0x02]: "Below low threshold",
									[0x03]: "Above high threshold",
								},
								// Translate missing event parameter to "no data"
								default: 0x01,
							},
						},
					},
				},
				{
					name: "Water level alarm status",
					states: {
						[0x09]: {
							label: "Water level alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "No data",
									[0x02]: "Below low threshold",
									[0x03]: "Above high threshold",
								},
								// Translate missing event parameter to "no data"
								default: 0x01,
							},
						},
					},
				},
				{
					name: "Pump status",
					states: {
						[0x0a]: {
							label: "Sump pump active",
						},
						[0x0b]: {
							label: "Sump pump failure",
							description:
								"This state may be used to indicate that the pump does not function as expected or is disconnected",
						},
					},
				},
			],
			events: {
				[0x03]: {
					label: "Water level dropped (location provided)",
					description:
						"The event parameters contain a location report",
				},
				[0x04]: {
					label: "Water level dropped",
				},
			},
		},
		[0x06]: {
			name: "Access Control",
			variables: [
				{
					name: "Lock state",
					states: {
						[0x0b]: {
							label: "Lock jammed",
						},
					},
				},
				{
					name: "Keypad state",
					states: {
						[0x10]: {
							label: "Keypad temporary disabled",
						},
						[0x11]: {
							label: "Keypad busy",
						},
					},
				},
				{
					name: "Door state",
					idle: false,
					states: {
						[0x16]: {
							label: "Window/door is open",
							parameter: {
								type: "enum",
								values: {
									// These values extend the existing states, so they need to be named in a similar fashion
									[0x00]:
										"Window/door is open in regular position",
									[0x01]:
										"Window/door is open in tilt position",
								},
							},
						},
						[0x17]: {
							label: "Window/door is closed",
						},
					},
				},
				{
					name: "Door handle state",
					idle: false,
					states: {
						[0x18]: {
							label: "Window/door handle is open",
						},
						[0x19]: {
							label: "Window/door handle is closed",
						},
					},
				},
				{
					name: "Barrier performing initialization process status",
					idle: false,
					states: {
						[0x40]: {
							label: "Barrier performing initialization process",
							parameter: {
								type: "enum",
								values: {
									[0x00]: "Process completed",
									[0xff]: "Performing process",
								},
							},
						},
					},
				},
				{
					name: "Barrier UL disabling status",
					states: {
						[0x45]: {
							label:
								"Barrier unattended operation has been disabled per UL requirements",
						},
					},
				},
				{
					name: "Barrier vacation mode status",
					idle: false,
					states: {
						[0x47]: {
							label: "Barrier vacation mode",
							parameter: {
								type: "enum",
								values: {
									[0x00]: "Mode disabled",
									[0xff]: "Mode enabled",
								},
							},
						},
					},
				},
				{
					name: "Barrier safety beam obstacle status",
					idle: false,
					states: {
						[0x48]: {
							label: "Barrier safety beam obstacle",
							parameter: {
								type: "enum",
								values: {
									[0x00]: "No obstruction",
									[0xff]: "Obstruction",
								},
							},
						},
					},
				},
				{
					name: "Barrier sensor status",
					states: {
						[0x49]: {
							label:
								"Barrier sensor not detected / supervisory error",
							// Param contains sensor ID
							parameter: {
								type: "value",
								propertyName: "sensor ID",
							},
						},
					},
				},
				{
					name: "Barrier battery status",
					states: {
						[0x4a]: {
							label: "Barrier sensor low battery warning",
							// Param contains sensor ID
							parameter: {
								type: "value",
								propertyName: "sensor ID",
							},
						},
					},
				},
				{
					name: "Barrier short-circuit status",
					states: {
						[0x4b]: {
							label:
								"Barrier detected short in wall station wires",
						},
					},
				},
				{
					name: "Barrier control status",
					states: {
						[0x4c]: {
							label:
								"Barrier associated with non Z-Wave remote control",
						},
					},
				},
			],
			events: {
				[0x01]: {
					label: "Manual lock operation",
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x02]: {
					label: "Manual unlock operation",
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x03]: {
					label: "RF lock operation",
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x04]: {
					label: "RF unlock operation",
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x05]: {
					label: "Keypad lock operation",
					// parameters contain User Code Report
					parameter: {
						type: "commandclass",
					},
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
						// Keypad state - Keypad temporary disabled
						0x10,
						// Keypad state - Keypad busy
						0x11,
					],
				},
				[0x06]: {
					label: "Keypad unlock operation",
					// parameters contain User Code Report
					parameter: {
						type: "commandclass",
					},
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
						// Keypad state - Keypad temporary disabled
						0x10,
						// Keypad state - Keypad busy
						0x11,
					],
				},
				[0x23]: {
					label: "Credential lock/open operation",
					// parameters contain Credential Usage Data
					parameter: {
						type: "commandclass",
					},
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
						// Keypad state - Keypad temporary disabled
						0x10,
						// Keypad state - Keypad busy
						0x11,
					],
				},
				[0x24]: {
					label: "Credential unlock/close operation",
					// parameters contain Credential Usage Data
					parameter: {
						type: "commandclass",
					},
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
						// Keypad state - Keypad temporary disabled
						0x10,
						// Keypad state - Keypad busy
						0x11,
					],
				},
				[0x07]: {
					label: "Manual not fully locked operation",
				},
				[0x08]: {
					label: "RF not fully locked operation",
				},
				[0x09]: {
					label: "Auto lock locked operation",
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x0a]: {
					label: "Auto lock not fully locked operation",
				},
				[0x0c]: {
					label: "All user codes deleted", // User Code CC
				},
				[0x0d]: {
					label: "Single user code deleted",
					parameter: {
						// Credential Notification Report (V8)
						type: "commandclass",
					},
				},
				[0x0e]: {
					label: "New user code added",
					parameter: {
						// Credential Notification Report (V8)
						type: "commandclass",
					},
				},
				[0x0f]: {
					label: "New user code not added due to duplicate code",
					parameter: {
						// Credential Notification Report (V8)
						type: "commandclass",
					},
				},
				[0x2F]: {
					label:
						"Valid credential access denied: User Active State set to Occupied Disabled",
					// parameters contain Credential Usage Data
					parameter: {
						type: "commandclass",
					},
				},
				[0x30]: {
					label: "Valid credential access denied: Schedule inactive",
					// parameters contain Credential Usage Data
					parameter: {
						type: "commandclass",
					},
				},
				[0x31]: {
					label:
						"Valid credential access denied: Not enough credentials entered",
					// parameters contain Credential Usage Data for the entered credentials
				},
				[0x32]: {
					label: "Invalid credential used",
				},
				[0x12]: {
					label:
						"New program code entered: unique code for lock configuration",
				},
				[0x13]: {
					label: "Manually enter user access code exceeds code limit",
				},
				[0x14]: {
					label: "Unlock by RF with invalid user code",
				},
				[0x15]: {
					label: "Locked by RF with invalid user code",
				},
				[0x20]: {
					label: "Messaging User Code entered via keypad",
					// Param contains UserCodeCC User Identifier (2 bytes)
					parameter: {
						type: "value",
						propertyName: "user ID",
					},
					idleVariables: [
						// Keypad state - Keypad temporary disabled
						0x10,
						// Keypad state - Keypad busy
						0x11,
					],
				},
				[0x33]: {
					label: "Non-Access credential entered via local interface",
					// parameters contain a partial User Credential Report:
					// User Unique Identifier, Credential Type, Credential Slot Number (V8)
					parameter: {
						type: "commandclass",
					},
				},
				[0x21]: {
					label: "Lock operation with User Code",
					// Param contains UserCodeCC User Identifier (2 bytes)
					parameter: {
						type: "value",
						propertyName: "user ID",
					},
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x22]: {
					label: "Unlock operation with User Code",
					// Param contains UserCodeCC User Identifier (2 bytes)
					parameter: {
						type: "value",
						propertyName: "user ID",
					},
					idleVariables: [
						// Lock state - Lock jammed
						0x0b,
					],
				},
				[0x41]: {
					label:
						"Barrier operation (open/close) force has been exceeded",
				},
				[0x42]: {
					label:
						"Barrier motor has exceeded manufacturer's operational time limit",
					parameter: {
						type: "duration",
					},
				},
				[0x43]: {
					label:
						"Barrier operation has exceeded physical mechanical limits",
				},
				[0x44]: {
					label:
						"Barrier unable to perform requested operation due to UL requirements",
				},
				[0x46]: {
					label:
						"Barrier failed to perform requested operation, device malfunction",
				},
			},
		},
		[0x07]: {
			name: "Home Security",
			variables: [
				{
					name: "Sensor status",
					states: {
						[0x01]: {
							label: "Intrusion (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Intrusion",
						},
					},
				},
				{
					name: "Cover status",
					states: {
						[0x03]: {
							label: "Tampering, product cover removed",
							description:
								"This event may be issued by an alarm device to advertise that the device has detected dust in its sensor. The device is not reliable until it has been serviced.",
						},
					},
				},
				{
					name: "Motion sensor status",
					states: {
						[0x07]: {
							label: "Motion detection (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x08]: {
							label: "Motion detection",
						},
					},
				},
				{
					name: "Magnetic interference status",
					states: {
						[0x0b]: {
							label: "Magnetic field interference detected",
							description:
								"This state is used to indicate that magnetic field disturbance have been detected and the product functionality may not work reliably.",
						},
					},
				},
			],
			events: {
				[0x04]: {
					label: "Tampering, invalid code",
				},
				[0x05]: {
					label: "Glass breakage (location provided)",
					description:
						"The event parameters contain a location report",
				},
				[0x06]: {
					label: "Glass breakage",
				},
				[0x09]: {
					label: "Tampering, product moved",
				},
				[0x0a]: {
					label: "Impact detected",
					description:
						"This event indicates that the node has detected an excessive amount of pressure or that an impact has occurred on the product itself.",
				},
				[0x0c]: {
					label: "RF Jamming detected",
					description:
						"This event can be issued if the node has detected a raise in the background RSSI level.",
					// 1-byte value representing the measured RSSI over a period of time spanning between 10s and 60s.
					// TODO: The value MUST be encoded using signed representation
					parameter: {
						type: "value",
						propertyName: "RSSI",
					},
				},
			},
		},
		[0x08]: {
			name: "Power Management",
			variables: [
				{
					name: "Power status",
					states: {
						[0x01]: {
							label: "Power has been applied",
						},
					},
				},
				{
					name: "Mains status",
					idle: false,
					states: {
						[0x02]: {
							label: "AC mains disconnected",
						},
						[0x03]: {
							label: "AC mains re-connected",
						},
					},
				},
				{
					name: "Over-current status",
					states: {
						[0x06]: {
							label: "Over-current detected",
						},
					},
				},
				{
					name: "Over-voltage status",
					states: {
						[0x07]: {
							label: "Over-voltage detected",
						},
					},
				},
				{
					name: "Over-load status",
					states: {
						[0x08]: {
							label: "Over-load detected",
						},
					},
				},
				{
					name: "Load error status",
					states: {
						[0x09]: {
							label: "Load error",
						},
					},
				},
				{
					name: "Battery maintenance status",
					states: {
						[0x0a]: {
							label: "Replace battery soon",
						},
						[0x0b]: {
							label: "Replace battery now",
						},
						[0x11]: {
							label: "Battery fluid is low",
						},
					},
				},
				{
					name: "Battery load status",
					states: {
						[0x0c]: {
							label: "Battery is charging",
						},
					},
				},
				{
					name: "Battery level status",
					states: {
						[0x0d]: {
							label: "Battery is fully charged",
						},
						[0x0e]: {
							label: "Charge battery soon",
						},
						[0x0f]: {
							label: "Charge battery now",
						},
					},
				},
				{
					name: "Backup battery level status",
					states: {
						[0x10]: {
							label: "Back-up battery is low",
						},
						[0x12]: {
							label: "Back-up battery disconnected",
						},
					},
				},
			],
			events: {
				[0x04]: {
					label: "Surge detected",
				},
				[0x05]: {
					label: "Voltage drop/drift",
				},
			},
		},
		[0x09]: {
			name: "System",
			variables: [
				{
					name: "Hardware status",
					states: {
						[0x01]: {
							label: "System hardware failure",
						},
						[0x03]: {
							label:
								"System hardware failure (with failure code)",
							description:
								"The event parameters contain a manufacturer proprietary failure code",
						},
					},
				},
				{
					name: "Software status",
					states: {
						[0x02]: {
							label: "System software failure",
						},
						[0x04]: {
							label:
								"System software failure (with failure code)",
							description:
								"The event parameters contain a manufacturer proprietary failure code",
						},
					},
				},
				{
					name: "Cover status",
					states: {
						[0x06]: {
							label: "Tampering, product cover removed",
						},
					},
				},
				{
					name: "Emergency shutoff status",
					states: {
						[0x07]: {
							label: "Emergency shutoff",
						},
					},
				},
			],
			events: {
				[0x05]: {
					label: "Heartbeat",
					description:
						"The Heartbeat event may be issued by a device to advertise that the device is still alive or to notify its presence.",
				},
			},
		},
		[0x0a]: {
			name: "Emergency Alarm",
			events: {
				[0x01]: {
					label: "Contact police",
				},
				[0x02]: {
					label: "Contact fire service",
				},
				[0x03]: {
					label: "Contact medical service",
				},
			},
		},
		[0x0b]: {
			name: "Clock",
			events: {
				[0x01]: {
					label: "Wake up alert",
				},
				[0x02]: {
					label: "Timer ended",
				},
				[0x03]: {
					label: "Time remaining",
					// TODO: The event parameter contains 3 bytes
					// Byte 1 - 0x00..0xFF: 0..255 hours
					// Byte 2 - 0x00..0xFF: 0..255 minutes
					// Byte 3 - 0x00..0xFF: 0..255 seconds
				},
			},
		},
		[0x0c]: {
			name: "Appliance",
			variables: [
				{
					name: "Program status",
					states: {
						[0x01]: {
							label: "Program started",
						},
						[0x02]: {
							label: "Program in progress",
						},
						[0x03]: {
							label: "Program completed",
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x04]: {
							label: "Replace main filter",
						},
					},
				},
				{
					name: "Appliance status",
					states: {
						[0x06]: {
							label: "Supplying water",
						},
						[0x08]: {
							label: "Boiling",
						},
						[0x0a]: {
							label: "Washing",
						},
						[0x0c]: {
							label: "Rinsing",
						},
						[0x0e]: {
							label: "Draining",
						},
						[0x10]: {
							label: "Spinning",
						},
						[0x12]: {
							label: "Drying",
						},
					},
				},
				{
					name: "Target temperature failure status",
					states: {
						[0x05]: {
							label: "Failure to set target temperature",
						},
					},
				},
				{
					name: "Water supply failure status",
					states: {
						[0x07]: {
							label: "Water supply failure",
						},
					},
				},
				{
					name: "Boiling failure status",
					states: {
						[0x09]: {
							label: "Boiling failure",
						},
					},
				},
				{
					name: "Washing failure status",
					states: {
						[0x0b]: {
							label: "Washing failure",
						},
					},
				},
				{
					name: "Rinsing failure status",
					states: {
						[0x0d]: {
							label: "Rinsing failure",
						},
					},
				},
				{
					name: "Draining failure status",
					states: {
						[0x0f]: {
							label: "Draining failure",
						},
					},
				},
				{
					name: "Spinning failure status",
					states: {
						[0x11]: {
							label: "Spinning failure",
						},
					},
				},
				{
					name: "Drying failure status",
					states: {
						[0x13]: {
							label: "Drying failure",
						},
					},
				},
				{
					name: "Fan failure status",
					states: {
						[0x14]: {
							label: "Fan failure",
						},
					},
				},
				{
					name: "Compressor failure status",
					states: {
						[0x15]: {
							label: "Compressor failure",
						},
					},
				},
			],
		},
		[0x0d]: {
			name: "Home Health",
			variables: [
				{
					name: "Position status",
					states: {
						[0x01]: {
							label: "Leaving bed",
						},
						[0x02]: {
							label: "Sitting on bed",
						},
						[0x03]: {
							label: "Lying on bed",
						},
						[0x05]: {
							label: "Sitting on bed edge",
						},
					},
				},
				{
					name: "VOC level status",
					idle: false,
					states: {
						[0x06]: {
							label: "Volatile Organic Compound level",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Clean",
									[0x02]: "Slightly polluted",
									[0x03]: "Moderately polluted",
									[0x04]: "Highly polluted",
								},
							},
						},
					},
				},
				{
					name: "Sleep apnea status",
					states: {
						[0x07]: {
							label: "Sleep apnea detected",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Low breath",
									[0x02]: "No breath at all",
								},
							},
						},
					},
				},
				{
					name: "Sleep stage status",
					states: {
						[0x08]: {
							label: "Sleep stage 0 detected (Dreaming/REM)",
						},
						[0x09]: {
							label:
								"Sleep stage 1 detected (Light sleep, non-REM 1)",
						},
						[0x0a]: {
							label:
								"Sleep stage 2 detected (Medium sleep, non-REM 2)",
						},
						[0x0b]: {
							label:
								"Sleep stage 3 detected (Deep sleep, non-REM 3)",
						},
					},
				},
			],
			events: {
				[0x04]: {
					label: "Posture changed",
				},
				[0x0c]: {
					label: "Fall detected",
					description:
						"This event is used to indicate that a person fall has been detected and medical help may be needed.",
				},
			},
		},
		[0x0e]: {
			name: "Siren",
			variables: [
				{
					name: "Siren status",
					states: {
						[0x01]: {
							label: "Siren active",
						},
					},
				},
			],
		},
		[0x0f]: {
			name: "Water Valve",
			variables: [
				{
					name: "Valve operation status",
					idle: false,
					states: {
						[0x01]: {
							label: "Valve operation",
							parameter: {
								type: "enum",
								values: {
									[0x00]: "Off / Closed",
									[0x01]: "On / Open",
								},
							},
						},
					},
				},
				{
					name: "Master valve operation status",
					idle: false,
					states: {
						[0x02]: {
							label: "Master valve operation",
							parameter: {
								type: "enum",
								values: {
									[0x00]: "Off / Closed",
									[0x01]: "On / Open",
								},
							},
						},
					},
				},
				{
					name: "Valve short circuit status",
					states: {
						[0x03]: {
							label: "Valve short circuit",
						},
					},
				},
				{
					name: "Master valve short circuit status",
					states: {
						[0x04]: {
							label: "Master valve short circuit",
						},
					},
				},
				{
					name: "Valve current alarm status",
					states: {
						[0x05]: {
							label: "Valve current alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "No data",
									[0x02]: "Below low threshold",
									[0x03]: "Above high threshold",
									[0x04]: "Max",
								},
								// Translate missing event parameter to "no data"
								default: 0x01,
							},
						},
					},
				},
				{
					name: "Master valve current alarm status",
					states: {
						[0x06]: {
							label: "Master valve current alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "No data",
									[0x02]: "Below low threshold",
									[0x03]: "Above high threshold",
									[0x04]: "Max",
								},
								// Translate missing event parameter to "no data"
								default: 0x01,
							},
						},
					},
				},
				{
					name: "Valve jammed status",
					states: {
						[0x07]: {
							label: "Valve jammed",
						},
					},
				},
			],
		},
		[0x10]: {
			name: "Weather Alarm",
			variables: [
				{
					name: "Rain alarm status",
					states: {
						[0x01]: {
							label: "Rain alarm",
						},
					},
				},
				{
					name: "Moisture alarm status",
					states: {
						[0x02]: {
							label: "Moisture alarm",
						},
					},
				},
				{
					name: "Freeze alarm status",
					states: {
						[0x03]: {
							label: "Freeze alarm",
						},
					},
				},
			],
		},
		[0x11]: {
			name: "Irrigation",
			variables: [
				{
					name: "Schedule (id) status",
					idle: false,
					states: {
						[0x01]: {
							label: "Schedule started",
							// Event parameter (1 byte) contains the schedule ID
							parameter: {
								type: "value",
								propertyName: "schedule ID",
							},
						},
						[0x02]: {
							label: "Schedule finished",
							// Event parameter (1 byte) contains the schedule ID
							parameter: {
								type: "value",
								propertyName: "schedule ID",
							},
						},
					},
				},
				{
					name: "Valve (id) run status",
					idle: false,
					states: {
						[0x03]: {
							label: "Valve table run started",
							// Event parameter (1 byte) contains the Valve table ID
							parameter: {
								type: "value",
								propertyName: "valve table ID",
							},
						},
						[0x04]: {
							label: "Valve table run finished",
							// Event parameter (1 byte) contains the Valve table ID
							parameter: {
								type: "value",
								propertyName: "valve table ID",
							},
						},
					},
				},
				{
					name: "Device configuration status",
					states: {
						[0x05]: {
							label: "Device is not configured",
						},
					},
				},
			],
		},
		[0x12]: {
			name: "Gas alarm",
			variables: [
				{
					name: "Combustible gas status",
					states: {
						[0x01]: {
							label:
								"Combustible gas detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Combustible gas detected",
						},
					},
				},
				{
					name: "Toxic gas status",
					states: {
						[0x03]: {
							label: "Toxic gas detected (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x04]: {
							label: "Toxic gas detected",
						},
					},
				},
				{
					name: "Alarm status",
					states: {
						[0x05]: {
							label: "Gas alarm test",
						},
					},
				},
				{
					name: "Maintenance status",
					states: {
						[0x06]: {
							label: "Replacement required",
						},
					},
				},
			],
		},
		[0x13]: {
			name: "Pest Control",
			variables: [
				{
					name: "Trap status",
					states: {
						[0x01]: {
							label: "Trap armed (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Trap armed",
						},
						[0x03]: {
							label: "Trap re-arm required (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x04]: {
							label: "Trap re-arm required",
						},
					},
				},
			],
			events: {
				[0x05]: {
					label: "Pest detected (location provided)",
					description:
						"The event parameters contain a location report",
				},
				[0x06]: {
					label: "Pest detected",
				},
				[0x07]: {
					label: "Pest exterminated (location provided)",
					description:
						"The event parameters contain a location report",
				},
				[0x08]: {
					label: "Pest exterminated",
				},
			},
		},
		[0x14]: {
			name: "Light sensor",
			variables: [
				{
					name: "Light detection status",
					states: {
						[0x01]: {
							label: "Light detected",
						},
					},
				},
			],
			events: {
				[0x02]: {
					label: "Light color transition detected",
				},
			},
		},
		[0x15]: {
			name: "Water Quality Monitoring",
			variables: [
				{
					name: "Chlorine alarm status",
					states: {
						[0x01]: {
							label: "Chlorine alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Below low threshold",
									[0x02]: "Above high threshold",
								},
							},
						},
					},
				},
				{
					name: "Acidity (pH) status",
					states: {
						[0x02]: {
							label: "Acidity (pH) alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Below low threshold",
									[0x02]: "Above high threshold",
									[0x03]: "Decreasing pH",
									[0x04]: "Increasing pH",
								},
							},
						},
					},
				},
				{
					name: "Water Oxidation alarm status",
					states: {
						[0x03]: {
							label: "Water Oxidation alarm",
							parameter: {
								type: "enum",
								values: {
									[0x01]: "Below low threshold",
									[0x02]: "Above high threshold",
								},
							},
						},
					},
				},
				{
					name: "Chlorine Sensor status",
					states: {
						[0x04]: {
							label: "Chlorine empty",
						},
					},
				},
				{
					name: "Acidity (pH) Sensor status",
					states: {
						[0x05]: {
							label: "Acidity (pH) empty",
						},
					},
				},
				{
					name: "Waterflow measuring station sensor",
					states: {
						[0x06]: {
							label:
								"Waterflow measuring station shortage detected",
						},
					},
				},
				{
					name: "Waterflow clear water sensor",
					states: {
						[0x07]: {
							label: "Waterflow clear water shortage detected",
						},
					},
				},
				{
					name: "Disinfection system status",
					states: {
						[0x08]: {
							label: "Disinfection system error detected",
							// TODO:
							// Event Parameter 1 byte bitmask=
							// - bits 0..3: represent System 1..4 disorder detected
							// - bits 4..7: represent System 1..4 salt shortage
						},
					},
				},
				{
					name: "Filter cleaning status",
					states: {
						[0x09]: {
							label: "Filter cleaning ongoing",
							// Event Parameter (1 byte) contains the # of the filter
							parameter: {
								type: "value",
								propertyName: "filter number",
							},
						},
					},
				},
				{
					name: "Heating status",
					states: {
						[0x0a]: {
							label: "Heating operation ongoing",
						},
					},
				},
				{
					name: "Filter pump status",
					states: {
						[0x0b]: {
							label: "Filter pump operation ongoing",
						},
					},
				},
				{
					name: "Freshwater flow status",
					states: {
						[0x0c]: {
							label: "Freshwater operation ongoing",
						},
					},
				},
				{
					name: "Dry protection status",
					states: {
						[0x0d]: {
							label: "Dry protection operation active",
						},
					},
				},
				{
					// This is defined as an event in the specs, but only makes sense as a status
					name: "Water tank status",
					idle: false,
					states: {
						[0x0e]: {
							label: "Water tank is empty",
						},
						[0x0f]: {
							label: "Water tank level is unknown",
						},
						[0x10]: {
							label: "Water tank is full",
						},
					},
				},
				{
					name: "Collective disorder status",
					states: {
						[0x11]: {
							label: "Collective disorder",
						},
					},
				},
			],
		},
		[0x16]: {
			name: "Home monitoring",
			variables: [
				{
					name: "Home occupancy status",
					states: {
						[0x01]: {
							label: "Home occupied (location provided)",
							description:
								"The event parameters contain a location report",
						},
						[0x02]: {
							label: "Home occupied",
						},
					},
				},
			],
		},
	} satisfies Record<number, NotificationDefinition>,
);

/** Returns the notification definition for the given notification type */
export function getNotification(type: number): Notification | undefined {
	const notification: NotificationDefinition | undefined =
		(notifications as any)[type];
	if (!notification) return;

	const events = new Map<number, NotificationEvent>();
	if (notification.events) {
		for (const [key, eventDef] of Object.entries(notification.events)) {
			const value = parseInt(key);
			events.set(value, notificationEventFromDefinition(eventDef, value));
		}
	}

	return {
		type,
		name: notification.name,
		variables: notification.variables?.map(
			notificationVariableFromDefinition,
		) ?? [],
		events,
	};
}

export function getNotificationName(type: number): string {
	const notification = getNotification(type);
	return notification?.name ?? `Unknown (${num2hex(type)})`;
}

/** Returns all defined notifications */
export function getAllNotifications(): readonly Notification[] {
	return Object.keys(notifications).map((type) =>
		getNotification(parseInt(type, 10))!
	);
}

/** Returns a notification's event or state with the given value */
export function getNotificationValue(
	notification: Notification,
	value: number,
): NotificationValue | undefined {
	return (
		notification.events.get(value)
			?? notification.variables?.find((v) => v.states.has(value))
				?.states.get(value)
	);
}

/** Returns the name of a given notification event (stateless only), or a default string */
export function getNotificationEventName(type: number, event: number): string {
	const notification = getNotification(type);
	return notification?.events.get(event)?.label
		?? `Unknown (${num2hex(event)})`;
}

/** Returns the name of a given notification state or event, or a default string */
export function getNotificationValueName(type: number, event: number): string {
	const notification = getNotification(type);
	const value = notification && getNotificationValue(notification, event);
	return value?.label ?? `Unknown (${num2hex(event)})`;
}

function notificationVariableFromDefinition(
	def: NotificationVariableDefinition,
): NotificationVariable {
	const states = new Map<number, NotificationState>();
	for (const [key, stateDef] of Object.entries(def.states)) {
		const value = parseInt(key);
		states.set(
			value,
			notificationStateFromDefinition(stateDef, def, value),
		);
	}
	return {
		name: def.name,
		idle: def.idle ?? true,
		states,
	};
}

function notificationStateFromDefinition(
	def: NotificationStateDefinition,
	variable: NotificationVariableDefinition,
	value: number,
): NotificationState {
	return {
		type: "state",
		label: def.label,
		description: def.description,
		variableName: variable.name,
		idle: variable.idle ?? true,
		value,
		parameter: def.parameter ? { ...def.parameter } : undefined,
		idleVariables: def.idleVariables
			? [...def.idleVariables]
			: [],
	};
}

function notificationEventFromDefinition(
	def: NotificationEventDefinition,
	value: number,
): NotificationEvent {
	return {
		type: "event",
		label: def.label,
		description: def.description,
		value,
		parameter: def.parameter ? { ...def.parameter } : undefined,
		idleVariables: def.idleVariables
			? [...def.idleVariables]
			: [],
	};
}
