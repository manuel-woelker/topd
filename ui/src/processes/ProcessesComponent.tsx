import * as React from "react";
import {Process} from "../app/reducers";
import {
	AutoSizer, Column, SortDirection, SortDirectionType, Table, TableCellProps,
	TableCellRenderer
} from 'react-virtualized'

function toFixed(input?: number) {
	if (input !== 0 && (!input || !input.toFixed)) {
		return input;
	}
	return input.toFixed(1);
}

const cmdCellRender: TableCellRenderer = (props: TableCellProps) => {
	let process = props.rowData as Process;
	return <span title={process.cmdline}><b>{process.cmd}</b>{process.cmdline?" - ":""}{process.cmdline}</span>
};

const cpuCellRender: TableCellRenderer = (props: TableCellProps) => {
	let cpu = props.cellData as number;
	return toFixed(cpu * 100) + " %";
};

const memoryCellRender: TableCellRenderer = (props: TableCellProps) => {
	let rss = props.cellData as number;
	return toFixed(rss / 1024 / 1024) + " MB";
};



export class ProcessesComponent extends React.Component<{processes?: Process[]}, {sortBy: string, sortDirection: SortDirectionType}>{
	constructor(...args: any[]) {
		super(...args);
		this.sort = this.sort.bind(this);
		this.state = {
			sortBy: "cpu",
			sortDirection: "DESC",
		};
	}

	render() {
		let processes = this.props.processes || [];
		processes = processes.slice();
		let sortBy = this.state.sortBy;
		let res = this.state.sortDirection == SortDirection.ASC ? -1 : 1;
		processes.sort((a: any, b: any) => b[sortBy] > a[sortBy] ? res : -res);

		return <AutoSizer>
			{({ height, width }) => (<Table
			width={width}
			height={height}
			headerHeight={20}
			rowHeight={30}
			sortBy={sortBy}
			sortDirection={this.state.sortDirection}
			sort={this.sort}
			rowCount={processes.length}
			rowGetter={({ index }) => processes[index]}
		>
			<Column
				label='PID'
				dataKey='pid'
				width={50}
				className="align-right"
			/>
			<Column
				width={200}
				label='Process'
				dataKey='cmdline'
				cellRenderer={cmdCellRender}
				flexGrow={1}
			/>
			<Column
				width={100}
				label='CPU'
				dataKey='cpu'
				cellRenderer={cpuCellRender}
				className="align-right"
				headerClassName="align-right"
			/>
			<Column
				width={100}
				label='Memory'
				dataKey='rss'
				cellRenderer={memoryCellRender}
				className="align-right"
				headerClassName="align-right"
			/>
		</Table>)}</AutoSizer>;
	}

	sort(sortState: { sortBy: string, sortDirection: SortDirectionType }) {
		this.setState(sortState)
	}
}











