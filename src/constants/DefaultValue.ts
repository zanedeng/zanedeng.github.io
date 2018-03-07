
class DefaultValue {
    static BASE_ROUTE_URL: string = typeof BASE_ROUTE_URL === 'undefined' ? '' : BASE_ROUTE_URL;
}

export default DefaultValue;