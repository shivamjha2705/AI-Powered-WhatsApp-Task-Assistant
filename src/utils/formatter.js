function formatResponse(results) {
    if (results.length === 0) {
        return "I couldn't find any matching tasks.";
    }

    let message = `I found ${results.length} matching task(s):\n`;

    results.forEach(task => {
        message += `- ${task.task} (${task.status}, ${task.priority}) assigned to ${task.assignedTo}\n`;
    });

    return message;
}

module.exports = { formatResponse };
