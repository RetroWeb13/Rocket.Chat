import { dbWatchersDisabled } from '@rocket.chat/core-services';
import {
	Messages,
	Users,
	Subscriptions,
	Settings,
	LivechatInquiry,
	LivechatDepartmentAgents,
	Rooms,
	Roles,
	LoginServiceConfiguration,
	InstanceStatus,
	IntegrationHistory,
	Integrations,
	EmailInbox,
	PbxEvents,
	Permissions,
	LivechatPriority,
} from '@rocket.chat/models';

const { DBWATCHER_EXCLUDE_COLLECTIONS = '', DBWATCHER_ONLY_COLLECTIONS = '' } = process.env;

const excludeCollections = DBWATCHER_EXCLUDE_COLLECTIONS.split(',')
	.map((collection) => collection.trim())
	.filter(Boolean);

const onlyCollections = DBWATCHER_ONLY_COLLECTIONS.split(',')
	.map((collection) => collection.trim())
	.filter(Boolean);

export function getWatchCollections(): string[] {
	const collections = [
		Users.getCollectionName(),
		LivechatInquiry.getCollectionName(),
		LivechatDepartmentAgents.getCollectionName(),
		InstanceStatus.getCollectionName(),
		IntegrationHistory.getCollectionName(),
		EmailInbox.getCollectionName(),
		Settings.getCollectionName(),
		Subscriptions.getCollectionName(),
	];

	// add back to the list of collections in case db watchers are enabled
	if (!dbWatchersDisabled) {
		collections.push(Messages.getCollectionName());
		collections.push(Roles.getCollectionName());
		collections.push(Rooms.getCollectionName());
		collections.push(PbxEvents.getCollectionName());
		collections.push(Integrations.getCollectionName());
		collections.push(Permissions.getCollectionName());
		collections.push(LivechatPriority.getCollectionName());
		collections.push(LoginServiceConfiguration.getCollectionName());
	}

	if (onlyCollections.length > 0) {
		return collections.filter((collection) => onlyCollections.includes(collection));
	}

	if (excludeCollections.length > 0) {
		return collections.filter((collection) => !excludeCollections.includes(collection));
	}

	return collections;
}
