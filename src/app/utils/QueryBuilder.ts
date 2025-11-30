import { Query, FilterQuery } from "mongoose";
import { excludeField } from "./constants";


export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;
  private filterQuery: FilterQuery<T> = {}; // ✅ Store for meta count

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
  const filter = { ...this.query };

  for (const field of excludeField) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field];
  }

  this.filterQuery = filter as FilterQuery<T>; // ✅ Fix type
  this.modelQuery = this.modelQuery.find(this.filterQuery);
  return this;
}

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";

    if (searchTerm) {
      const searchConditions = {
        $or: searchableField.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };

      this.filterQuery = {
        ...this.filterQuery,
        ...searchConditions,
      };

      this.modelQuery = this.modelQuery.find(searchConditions);
    }

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    // ✅ Use filtered query here
    const totalDocuments = await this.modelQuery.model.countDocuments(this.filterQuery);
    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}