import useRouter from "./useRouter";

export const useIdFromPath = function<String> (
pathBeforeId: string
): string | undefined {
    const {router} = useRouter();
    if(!!router.location){
        const path = router.location.pathname;
        const sliceIndex = path.lastIndexOf(pathBeforeId) + pathBeforeId.length;
        const id = path.slice(sliceIndex);
        return id;
    }   
    else return undefined;
}

export default useIdFromPath;
