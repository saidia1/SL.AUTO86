export const services = [
    {
        id: 1,
        name: "Oil Change",
        description: "Regular oil changes to keep your engine running smoothly.",
        price: 29.99
    },
    {
        id: 2,
        name: "Tire Rotation",
        description: "Ensure even tire wear and extend the life of your tires.",
        price: 19.99
    },
    {
        id: 3,
        name: "Brake Inspection",
        description: "Comprehensive brake inspection to ensure safety.",
        price: 49.99
    },
    {
        id: 4,
        name: "Battery Replacement",
        description: "Quick and reliable battery replacement services.",
        price: 89.99
    },
    {
        id: 5,
        name: "Transmission Service",
        description: "Full transmission service to keep your vehicle in top shape.",
        price: 149.99
    }
];

export function getServiceById(id) {
    return services.find(service => service.id === id);
}

export function getAllServices() {
    return services;
}