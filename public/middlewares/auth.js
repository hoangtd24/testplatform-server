const LogAccess = ({ context, info }, next) => {
    const username = context.username || "guest";
    console.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`);
    return next();
};
//# sourceMappingURL=auth.js.map