

const useGetTokens = async () => {
    try {
        const response = await fetch(`/api/tokens`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching time.");
        return null;
    }
}

export default useGetTokens;
