// @flow
import * as React from "react";
import difference from "lodash/difference";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import { getPageLink } from "../../Domain/Global";
import Layout, { LayoutPlate, LayoutContent, LayoutFooter } from "../../Components/Layout/Layout";
import { ColumnStack, RowStack, Fill, Fit } from "../../Components/ItemsStack/ItemsStack";
import SearchSelector from "../../Components/SearchSelector/SearchSelector";
import AddingButton from "../../Components/AddingButton/AddingButton";
import TriggerList from "../../Components/TriggerList/TriggerList";
import type { Trigger } from "../../Domain/Trigger";
import type { Maintenance } from "../../Domain/Maintenance";

type Props = {|
    selectedTags: string[],
    subscribedTags: string[],
    allTags: string[],
    onlyProblems: boolean,
    triggers: Array<Trigger>,
    activePage: number,
    pageCount: number,
    onChange: (triggerId: string, metric: string, maintenance: Maintenance) => void,
    searchText: string,
    loading: boolean,
    error: string,
    onSetMetricMaintenance: (triggerId: string, metric: string, maintenance: Maintenance) => void,
    onRemoveMetric: (triggerId: string, metric: string) => void,
|};

class TriggerListDesktop extends React.Component<Props> {
    render() {
        const {
            selectedTags,
            subscribedTags,
            allTags,
            onlyProblems,
            triggers,
            activePage,
            pageCount,
            onChange,
            searchText,
            loading,
            error,
            onSetMetricMaintenance,
            onRemoveMetric,
        } = this.props;

        return (
            <Layout loading={loading} error={error}>
                <LayoutPlate>
                    <RowStack verticalAlign="baseline" block gap={3}>
                        <Fill>
                            <SearchSelector
                                search={searchText}
                                selectedTokens={selectedTags}
                                subscribedTokens={difference(subscribedTags, selectedTags)}
                                remainingTokens={difference(allTags, selectedTags)}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                            />
                        </Fill>
                        <Fit>
                            <Toggle
                                checked={onlyProblems}
                                onValueChange={value => onChange({ onlyProblems: value })}
                            />{" "}
                            Only Problems
                        </Fit>
                    </RowStack>
                </LayoutPlate>
                <LayoutContent>
                    <ColumnStack block gap={6} horizontalAlign="stretch">
                        <AddingButton to={getPageLink("triggerAdd")} />
                        <TriggerList
                            searchMode={searchText !== ""}
                            items={triggers}
                            onChange={onSetMetricMaintenance}
                            onRemove={onRemoveMetric}
                        />
                    </ColumnStack>
                </LayoutContent>
                {pageCount > 1 && (
                    <LayoutFooter>
                        <Paging
                            caption="Next page"
                            activePage={activePage}
                            pagesCount={pageCount}
                            onPageChange={page => onChange({ page })}
                            withoutNavigationHint
                        />
                    </LayoutFooter>
                )}
            </Layout>
        );
    }

    handleChange = (tags: string[], searchText: string) => {
        const { onChange } = this.props;
        onChange({ tags, searchText });
    };

    handleSearch = (searchText: string) => {
        const { onChange } = this.props;
        onChange({ searchText });
    };
}

export { TriggerListDesktop as default };
