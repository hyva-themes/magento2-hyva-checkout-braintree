
export function prepareAddress(address) {
    return {
        company: '',
        firstname: address.name.split(' ').slice(0, -1).join(' '),
        lastname: address.name.split(' ').slice(-1).join(' '),
        street: [address.address1, address.address2, address.address3],
        phone: address.phoneNumber,
        zipcode: address.postalCode,
        city: address.locality,
        region: address.administrativeArea,
        country: address.countryCode,
    };
}
