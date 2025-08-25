import {TaskDTO} from "../../../types/api";
import {useEffect, useState} from "react";
import type {TaskAdvicePanel} from "../../../types/api";


const TaskAdvicePanel: React.FC<TaskAdvicePanel> = ({ taskData, isVisible }) => {
    // const [advice, setAdvice] = useState<TaskAdvice | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible && taskData.name && taskData.description) {
            fetchAdvice();
        }
    }, [taskData, isVisible]);

    const fetchAdvice = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/predict/advice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
            const result = await response.json();
            // setAdvice(result.advice);
        } catch (error) {
            console.error('Failed to fetch advice:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="advice-panel">
            {/*{loading ? <AdviceLoadingSpinner /> : <AdviceContent advice={advice} />}*/}
        </div>
    );
};