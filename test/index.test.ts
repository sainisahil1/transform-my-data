import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
    createEmptyDepartmentInfo,
    getAgeRangeObject,
    getAgeRangeString,
    getUpdatedAgeRange, initiateProcessing, processUsers, updateAddress,
    updateGender, updateHairColor
} from "../src";
import {DepartmentInfo, TransformedUserData, User, UsersResponse} from "../src/types";

describe("User data processing", () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    describe("createEmptyDepartmentInfo", () => {
        it("should create an empty DepartmentInfo object", () => {
            const result = createEmptyDepartmentInfo();
            expect(result).toEqual({
                male: 0,
                female: 0,
                ageRange: "",
                hair: {},
                addressUser: {}
            })
        });
    });

    describe("getAgeRangeObject", () => {
        it("should parse the age range correctly", () => {
            const result = getAgeRangeObject("20-40");
            expect(result).toEqual({min: 20, max: 40});
        });
        it("should return default values for empty string", () => {
            const result = getAgeRangeObject("");
            expect(result).toEqual({min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER});
        });
    });

    describe("getAgeRangeString", () => {
        it("should create age range string correctly", () => {
            const result = getAgeRangeString({min: 20, max: 40});
            expect(result).toBe("20-40");
        });
    });

    describe("getUpdatedAgeRange", () => {
        it("should update minimum range when age is smaller", () => {
            const result = getUpdatedAgeRange(18, "20-40");
            expect(result).toBe("18-40");
        });
        it("should update maximum range when age is larger", () => {
            const result = getUpdatedAgeRange(43, "20-40");
            expect(result).toBe("20-43");
        });
        it("should not change the range when age is neither smaller nor larger", () => {
            const result = getUpdatedAgeRange(25, "20-40");
            expect(result).toBe("20-40");
        });
        it("should handle the initial age range input", () => {
            const result = getUpdatedAgeRange(24, "");
            expect(result).toBe("24-24");
        });
    });

    describe("updateGender", () => {
        it("should increment male count for male gender", () => {
            const departmentInfo: DepartmentInfo = createEmptyDepartmentInfo();
            updateGender("male", departmentInfo);
            expect(departmentInfo.male).toBe(1);
            expect(departmentInfo.female).toBe(0);
        });
        it("should increment female count for female gender", () => {
            const departmentInfo: DepartmentInfo = createEmptyDepartmentInfo();
            updateGender("female", departmentInfo);
            expect(departmentInfo.male).toBe(0);
            expect(departmentInfo.female).toBe(1);
        });
    });

    describe("updateHairColor", () => {
        it("should increment count for existing hair color", () => {
            const departmentInfo: DepartmentInfo = createEmptyDepartmentInfo();
            departmentInfo.hair = {"Black":2};
            updateHairColor(departmentInfo, "Black");
            expect(departmentInfo.hair["Black"]).toBe(3);
        });
        it('should set count to 1 for new hair color', () => {
            const departmentInfo: DepartmentInfo = createEmptyDepartmentInfo();
            updateHairColor(departmentInfo, "Red");
            expect(departmentInfo.hair["Red"]).toBe(1);
        });
    });

    describe("updateAddress", () => {
        it('should add new address with postal code', () => {
            const departmentInfo: DepartmentInfo = createEmptyDepartmentInfo();
            updateAddress("Chandler", "Bing", departmentInfo, "12345");
            expect(departmentInfo.addressUser["ChandlerBing"]).toBe("12345");
        });
    });

    describe("processUser", () => {
        it('should process users and update department info correctly', () => {
            const users: User[] = [
                {
                    id: 1,
                    firstName: "John",
                    lastName: "Doe",
                    maidenName: "",
                    age: 30,
                    gender: "male",
                    email: "",
                    phone: "",
                    username: "",
                    password: "",
                    birthDate: "",
                    image: "",
                    bloodGroup: "",
                    height: 0,
                    weight: 0,
                    eyeColor: "",
                    hair: {
                        color: "Black",
                        type: ""
                    },
                    ip: "",
                    address: {
                        address: "",
                        city: "",
                        state: "",
                        stateCode: "",
                        postalCode: "12345",
                        coordinates: {
                            lat: 0,
                            lng: 0
                        },
                        country: ""
                    },
                    macAddress: "",
                    university: "",
                    bank: {
                        cardExpire: "",
                        cardNumber: "",
                        cardType: "",
                        currency: "",
                        iban: ""
                    },
                    company: {
                        department: "Engineering",
                        name: "",
                        title: "",
                        address: {
                            address: "",
                            city: "",
                            state: "",
                            stateCode: "",
                            postalCode: "",
                            coordinates: {
                                lat: 0,
                                lng: 0
                            },
                            country: ""
                        }
                    },
                    ein: "",
                    ssn: "",
                    userAgent: "",
                    crypto: {
                        coin: "",
                        wallet: "",
                        network: ""
                    },
                    role: ""
                }
            ];

            const finalData: TransformedUserData = {};
            processUsers(users, finalData);
            expect(finalData["Engineering"]).toBeDefined();
            expect(finalData["Engineering"].male).toBe(1);
            expect(finalData["Engineering"].ageRange).toBe("30-30");
            expect(finalData["Engineering"].hair["Black"]).toBe(1);
            expect(finalData["Engineering"].addressUser["JohnDoe"]).toBe("12345");
        });
        it('should handle empty users array', () => {
            const finalData: TransformedUserData = {};
            processUsers([], finalData);
            expect(Object.keys(finalData)).toHaveLength(0);
        });
    });

    describe("initiateProcessing", () => {
        it('should process multiple API calls and process all users', async () => {
            const mockData1: UsersResponse = {
                users: [
                    {
                        id: 1,
                        firstName: "John",
                        lastName: "Doe",
                        maidenName: "",
                        age: 30,
                        gender: "male",
                        hair: {color: "Black", type: ""},
                        address: {
                            postalCode: "12345",
                            address: "",
                            city: "",
                            state: "",
                            stateCode: "",
                            coordinates: {lat: 0, lng: 0},
                            country: ""
                        },
                        company: {
                            department: "Engineering",
                            name: "",
                            title: "",
                            address: {
                                address: "",
                                city: "",
                                state: "",
                                stateCode: "",
                                postalCode: "",
                                coordinates: {lat: 0, lng: 0},
                                country: ""
                            }
                        },
                    } as User
                ],
                total: 2,
                skip: 0,
                limit: 1
            };
            const mockData2: UsersResponse = {
                users: [
                    {
                        id: 2,
                        firstName: "Jane",
                        lastName: "Smith",
                        maidenName: "",
                        age: 25,
                        gender: "female",
                        hair: {color: "Blonde", type: ""},
                        address: {
                            postalCode: "54321",
                            address: "",
                            city: "",
                            state: "",
                            stateCode: "",
                            coordinates: {lat: 0, lng: 0},
                            country: ""
                        },
                        company: {
                            department: "Engineering",
                            name: "",
                            title: "",
                            address: {
                                address: "",
                                city: "",
                                state: "",
                                stateCode: "",
                                postalCode: "",
                                coordinates: {lat: 0, lng: 0},
                                country: ""
                            }
                        },
                        // ... other required fields with empty values
                    } as User
                ],
                total: 2,
                skip: 1,
                limit: 1
            };

            mockAxios.onGet("https://dummyjson.com/users")
                .replyOnce(200, mockData1)
                .onGet("https://dummyjson.com/users")
                .replyOnce(200, mockData2);

            const result = await initiateProcessing();
            expect(result["Engineering"]).toBeDefined();
            expect(result["Engineering"].male).toBe(1);
            expect(result["Engineering"].female).toBe(1);
            expect(result["Engineering"].ageRange).toBe("25-30");
            expect(result["Engineering"].hair["Black"]).toBe(1);
            expect(result["Engineering"].hair["Blonde"]).toBe(1);
            expect(result["Engineering"].addressUser["JohnDoe"]).toBe("12345");
            expect(result["Engineering"].addressUser["JaneSmith"]).toBe("54321");
        });
    });

});
