function applyFilter(rows, filter) {
    const assigneeFilter = filter.assignee || filter.assignedTo;

    return rows.filter(r =>
        (!assigneeFilter || (r.assignedTo && r.assignedTo.toLowerCase() === assigneeFilter.toLowerCase())) &&
        (!filter.status || (r.status && r.status.toLowerCase() === filter.status.toLowerCase())) &&
        (!filter.priority || (r.priority && r.priority.toLowerCase() === filter.priority.toLowerCase()))
    );
}

module.exports = { applyFilter };
