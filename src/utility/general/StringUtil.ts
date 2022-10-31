class StringUtil {

    public isEmpty(value: string) {
        return value === null || value === undefined || value === ""
    }

    public isNotEmpty(value: string) {
        return !this.isEmpty(value)
    }
}

export const stringUtil = new StringUtil();
