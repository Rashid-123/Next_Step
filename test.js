const api = "http://localhost:5000/api/bookmark"
token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFjMzIxOTgzNGRhNTBlMjBmYWVhZWE3Yzg2Y2U3YjU1MzhmMTdiZTEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUmFzaGlkIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xGcXlYc3JuS0dDWWdsTUZwTjhOWml0RHZHUkgzUTh2WWctZUo2Z09GUG5TQnBPWkpLPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3JlZmVycmFsLWE0MGM4IiwiYXVkIjoicmVmZXJyYWwtYTQwYzgiLCJhdXRoX3RpbWUiOjE3Njk1MDkxNzEsInVzZXJfaWQiOiJNY3gwVU1xMWNNZkZhQnlTY0E1bVlmRmN2YXMxIiwic3ViIjoiTWN4MFVNcTFjTWZGYUJ5U2NBNW1ZZkZjdmFzMSIsImlhdCI6MTc2OTUwOTE3MSwiZXhwIjoxNzY5NTEyNzcxLCJlbWFpbCI6InNoYWRhbnJhc2hpZDc4NkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNTIyNTA4Mzg3MjQyODUzODEyNiJdLCJlbWFpbCI6WyJzaGFkYW5yYXNoaWQ3ODZAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.UVmSOu7bQLwroY42WDQpfMjrm4E7D-CIBBolabmQw9HfQ2JNY6Hn0TSTXIMhgk37dgBxrZdarmdB8fzcdX9Hxo-6-HaZnEcIeqhfX-UE6wYQgFXw5A3ejvj0EID4wfauhhnLSQY6Rss9zQS6f-Q6yStY-sy3NYkmGpffbWNFNYfp9L-D3EtEKutYX6AKBuqN6i2qGTkxHf0ita7xTouQ5wUrqeva4gvN_08tPieJoFC5U4Da8C4X6t3V0R-N2k6f6SBIyKGMCQw2ktI96RNs6N2q__iagTsZuhTlKQ__uz7Cb5zDo8BcHGGqv2csYmWnXVfBnUUGCiUn7VTEnkhIeA"

let count = 0;
async function fetchData() {
    try {
        const res = await fetch(api, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        if (!res.ok) {
            throw new Error(`HTTP error! Status:${res.status}`)
        }
        count++;
        console.log(`------- Count = ${count}`);
    } catch (error) {
        console.error(error);
    }


}



setTimeout(() => {
    let c = 0;
    for (let i = 0; i < 12; i++) {
        c++;
        console.log(`-------${c}`)
        fetchData();
    }
}, 2000)



// const intervalId = setInterval(() => {
//     fetchData();
// }, 50);

// setTimeout(() => {
//     clearInterval(intervalId)
// }, 2000);