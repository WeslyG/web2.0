// @flow
import * as React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import AddIcon from "@skbkontur/react-icons/Add";
import type { Subscription } from "../../Domain/Subscription";
import type { Contact } from "../../Domain/Contact";
import { createSchedule, WholeWeek } from "../../Domain/Schedule";
import TagGroup from "../TagGroup/TagGroup";
import ContactInfo from "../ContactInfo/ContactInfo";
import SubscriptionEditModal from "../SubscriptionEditModal/SubscriptionEditModal";
import CreateSubscriptionModal from "../CreateSubscriptionModal/CreateSubscriptionModal";
import type { SubscriptionInfo } from "../SubscriptionEditor/SubscriptionEditor";
import cn from "./SubscriptionList.less";

export type { SubscriptionInfo };

type Props = {
    onAddSubscription: SubscriptionInfo => Promise<?Subscription>,
    onRemoveSubscription: Subscription => Promise<void>,
    onUpdateSubscription: Subscription => Promise<void>,
    onTestSubscription: Subscription => Promise<void>,
    tags: Array<string>,
    contacts: Array<Contact>,
    subscriptions: Array<Subscription>,
};

type State = {
    newSubscriptionModalVisible: boolean,
    newSubscription: ?SubscriptionInfo,
    subscriptionEditModalVisible: boolean,
    subscriptionToEdit: ?Subscription,
};

export default class SubscriptionList extends React.Component<Props, State> {
    props: Props;

    state: State = {
        newSubscriptionModalVisible: false,
        newSubscription: null,
        subscriptionEditModalVisible: false,
        subscriptionToEdit: null,
    };

    render(): React.Element<any> {
        const { tags, contacts, subscriptions } = this.props;
        const {
            newSubscriptionModalVisible,
            newSubscription,
            subscriptionEditModalVisible,
            subscriptionToEdit,
        } = this.state;
        return (
            <div>
                {subscriptions.length > 0 ? (
                    <div>
                        <h3 className={cn("header")}>Subscriptions</h3>
                        <div className={cn("items-container")}>
                            <table className={cn("items")}>
                                <tbody>
                                    {subscriptions.map(subscription =>
                                        this.renderSubscriptionRow(subscription)
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className={cn("actions-block")}>
                            <Button
                                use="primary"
                                icon={<AddIcon />}
                                onClick={this.handleAddSubscription}
                            >
                                Add subscription
                            </Button>
                        </div>
                    </div>
                ) : (
                    this.renderAddSubscriptionMessage()
                )}
                {newSubscriptionModalVisible && newSubscription != null && (
                    <CreateSubscriptionModal
                        subscription={newSubscription}
                        tags={tags}
                        contacts={contacts}
                        onChange={update =>
                            this.setState({ newSubscription: { ...newSubscription, ...update } })
                        }
                        onCancel={() => this.setState({ newSubscriptionModalVisible: false })}
                        onCreateSubscription={this.handleCreateSubscription}
                        onCreateAndTestSubscription={this.handleCreateAndTestSubscription}
                    />
                )}
                {subscriptionEditModalVisible && subscriptionToEdit != null && (
                    <SubscriptionEditModal
                        subscription={subscriptionToEdit}
                        tags={tags}
                        contacts={contacts}
                        onChange={update =>
                            this.setState({
                                subscriptionToEdit: { ...subscriptionToEdit, ...update },
                            })
                        }
                        onCancel={() => this.setState({ subscriptionEditModalVisible: false })}
                        onUpdateSubscription={this.handleUpdateSubscription}
                        onUpdateAndTestSubscription={this.handleUpdateAndTestSubscription}
                        onRemoveSubscription={this.handleRemoveSubscription}
                    />
                )}
            </div>
        );
    }

    handleEditSubscription = (subscription: Subscription) => {
        this.setState({
            subscriptionEditModalVisible: true,
            subscriptionToEdit: subscription,
        });
    };

    handleAddSubscription = () => {
        this.setState({
            newSubscriptionModalVisible: true,
            newSubscription: {
                any_tags: false,
                sched: createSchedule(WholeWeek),
                tags: [],
                throttling: false,
                contacts: [],
                enabled: true,
                ignore_recoverings: false,
                ignore_warnings: false,
                plotting: {
                    enabled: true,
                    theme: "light",
                },
            },
        });
    };

    handleCreateSubscription = async () => {
        const { onAddSubscription } = this.props;
        const { newSubscription } = this.state;
        if (newSubscription == null) {
            throw new Error("InvalidProgramState");
        }
        await onAddSubscription(newSubscription);
        this.setState({
            newSubscriptionModalVisible: false,
            newSubscription: null,
        });
    };

    handleCreateAndTestSubscription = async () => {
        const { onAddSubscription, onTestSubscription } = this.props;
        const { newSubscription } = this.state;
        if (newSubscription == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            const subscription = await onAddSubscription(newSubscription);
            if (subscription !== null && subscription !== undefined) {
                await onTestSubscription(subscription);
            }
        } finally {
            this.setState({
                newSubscriptionModalVisible: false,
                newSubscription: null,
            });
        }
    };

    handleUpdateSubscription = async () => {
        const { onUpdateSubscription } = this.props;
        const { subscriptionToEdit } = this.state;
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
        } finally {
            this.setState({
                subscriptionEditModalVisible: false,
                subscriptionToEdit: null,
            });
        }
    };

    handleUpdateAndTestSubscription = async () => {
        const { onUpdateSubscription, onTestSubscription } = this.props;
        const { subscriptionToEdit } = this.state;
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
            await onTestSubscription(subscriptionToEdit);
        } finally {
            this.setState({
                subscriptionEditModalVisible: false,
                subscriptionToEdit: null,
            });
        }
    };

    handleRemoveSubscription = async () => {
        const { onRemoveSubscription } = this.props;
        const { subscriptionToEdit } = this.state;
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onRemoveSubscription(subscriptionToEdit);
        } finally {
            this.setState({
                subscriptionEditModalVisible: false,
                subscriptionToEdit: null,
            });
        }
    };

    renderSubscriptionRow(subscription: Subscription): React.Node {
        const { contacts } = this.props;
        return (
            <tr
                key={subscription.id}
                className={cn("item")}
                onClick={() => this.handleEditSubscription(subscription)}
            >
                <td className={cn("tags-cell")}>
                    <TagGroup tags={subscription.tags} />
                </td>
                <td className={cn("contacts-cell")}>
                    <Gapped gap={10}>
                        {subscription.contacts
                            .map(x => contacts.find(y => y.id === x))
                            .filter(Boolean)
                            .map(x => (
                                <ContactInfo key={x.id} contact={x} />
                            ))}
                    </Gapped>
                </td>
                <td className={cn("enabled-cell")}>
                    {!subscription.enabled && (
                        <span className={cn("disabled-label")}>Disabled</span>
                    )}
                </td>
            </tr>
        );
    }

    renderAddSubscriptionMessage(): React.Node {
        return (
            <Center>
                <Gapped vertical gap={20}>
                    <div>
                        To start receiving notifications you have to{" "}
                        <Button use="link" onClick={this.handleAddSubscription}>
                            add subscription
                        </Button>
                        .
                    </div>
                    <Center>
                        <Button
                            use="primary"
                            icon={<AddIcon />}
                            onClick={this.handleAddSubscription}
                        >
                            Add subscription
                        </Button>
                    </Center>
                </Gapped>
            </Center>
        );
    }
}
