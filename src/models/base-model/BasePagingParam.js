export default class BasePagingParam {
    constructor (PageIndex, PageSize, ListFilter,FilterFormula ,ListOrderBy, TableName) {
        this.PageIndex = PageIndex;
        this.PageSize = PageSize;
        this.ListFilter = ListFilter;
        this.ListOrderBy = ListOrderBy;
        this.FilterFormula = FilterFormula;
        this.TableName = TableName;
    }
}
