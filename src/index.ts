import {AgeRange, DepartmentInfo, TransformedUserData, User, UsersResponse} from "./types";
import axios from "axios";

export async function fetchData(skip: number): Promise<UsersResponse> {
    try{
        const response = await axios.get('https://dummyjson.com/users', {
            params: {
                skip: skip
            },
            timeout: 5000 //not required but good practice
        });
        return response.data;
    } catch (e){
        console.error(e);
        return new class implements UsersResponse {
            limit: number = 0;
            skip: number = 0;
            total: number =Number.MAX_SAFE_INTEGER;
            users: User[] = [];
        }
    }
}

function createEmptyDepartmentInfo(): DepartmentInfo{
    return new class implements DepartmentInfo {
        male: number = 0;
        female: number = 0;
        ageRange: string = "";
        hair = {};
        addressUser = {};
    }
}

function getAgeRangeObject(ageRangeString: string): AgeRange{
    if (!ageRangeString || ageRangeString === "") {
        return new class implements AgeRange {
            max: number = Number.MIN_SAFE_INTEGER;
            min: number = Number.MAX_SAFE_INTEGER;
        }
    }
    const [minVal, maxVal] = ageRangeString.split('-');
    return new class implements AgeRange {
        max: number = parseInt(maxVal);
        min: number = parseInt(minVal);
    }
}

function getAgeRangeString(ageRangeObject: AgeRange): string{
    return `${ageRangeObject.min}-${ageRangeObject.max}`;
}


function getUpdatedAgeRange(age: number, ageRange: string): string {
    const rangeObj = getAgeRangeObject(ageRange);
    rangeObj.min = Math.min(age, rangeObj.min);
    rangeObj.max = Math.max(age, rangeObj.max);
    return getAgeRangeString(rangeObj);
}

function updateGender(gender: "male" | "female", departmentInfo: DepartmentInfo) {
    if (gender === 'male') {
        departmentInfo.male++;
    } else {
        departmentInfo.female++;
    }
}

function updateHairColor(departmentInfo: DepartmentInfo, hairColor: string) {
    const hairColorCount: number = departmentInfo.hair[hairColor] ?? 0;
    departmentInfo.hair[hairColor] = hairColorCount + 1;
}

function updateAddress(firstName: string, lastName: string, departmentInfo: DepartmentInfo, postalCode: string) {
    const nameKey = firstName + lastName;
    departmentInfo.addressUser[nameKey] = postalCode;
}

export function processUsers(users: User[], finalData: TransformedUserData) {
    if (!users || !Array.isArray(users) || !finalData) return;
    for (const item of users) {
        const department: string = item.company.department;
        const gender: "male" | "female" = item.gender
        const age: number = item.age;
        const hairColor: string = item.hair.color;
        const firstName: string = item.firstName;
        const lastName: string = item.lastName;
        const postalCode: string = item.address.postalCode;

        let departmentInfo = finalData[department];

        if (!departmentInfo) {
            departmentInfo = createEmptyDepartmentInfo();
        }

        updateGender(gender, departmentInfo);
        departmentInfo.ageRange = getUpdatedAgeRange(age, departmentInfo.ageRange);
        updateHairColor(departmentInfo, hairColor);
        updateAddress(firstName, lastName, departmentInfo, postalCode);

        finalData[department] = departmentInfo;
    }
}

export async function initiateProcessing() : Promise<TransformedUserData>{
    const finalData: TransformedUserData = {};
    let skip = 0;
    let total = Number.MAX_SAFE_INTEGER;
    while (skip < total) {
        const usersResponse: UsersResponse = await fetchData(skip);
        total = usersResponse.total
        const users: User[] = usersResponse.users;
        skip += users.length;
        processUsers(users, finalData);
    }
    return finalData;
}

if (require.main === module){
    async function main() {
        const finalData: TransformedUserData = await initiateProcessing();
        console.log(JSON.stringify(finalData));
    }
    main();
}
