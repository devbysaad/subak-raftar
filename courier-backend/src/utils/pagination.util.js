const paginate = async (Model, filter = {}, query = {}) => {
    const page  = Math.max(parseInt(query.page)  || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const skip  = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Model.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
    };
};

module.exports = { paginate };
