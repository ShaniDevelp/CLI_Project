import React, { useEffect, useState } from "react";
import Chart from "./chartData";

const ResultOutput = ({ output }) => {
    const [result, setResult] = useState("");
    const [index, setindex] = useState(0);

    useEffect(() => {
        setindex(0);
        setResult(output?.message)
        const interval = setInterval(() => {
            setindex((prevIndex) => {
                if (result && prevIndex < result.length) {
                    return prevIndex + 2;
                } else {
                    clearInterval(interval);
                    return prevIndex;
                }
            });
        }, 20);

        return () => clearInterval(interval);
    }, [result]);

    const formatMessage = (message) => {
        return message && message.split(" - ").join("<br />");
    };

    return (
        <div className=" w-[60%]">
            <p
                className="text-gray-300 text-lg leading-8"
                dangerouslySetInnerHTML={{ __html: formatMessage(result?.substring(0, index)) }}
            ></p>

            {output?.type === 'chart' && <Chart data={output?.data} />}
        </div>
    )
}

export default ResultOutput