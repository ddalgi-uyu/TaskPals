'use client';

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

// Import animation files for different pet colors and stages
import PinkEgg from "@/assets/egg_pink_2.json";
import PinkKitten from "@/assets/kitten_pink_2.json";
import PinkCat from "@/assets/cat_pink_2.json";
import BlueEgg from "@/assets/egg_blue_2.json";
import BlueKitten from "@/assets/kitten_blue_2.json";
import BlueCat from "@/assets/cat_blue_2.json";
import YellowEgg from "@/assets/egg_yellow_2.json";
import YellowKitten from "@/assets/kitten_yellow_2.json";
import YellowCat from "@/assets/cat_yellow_2.json";

const PetProgressBar = ({ taskForProgressBar, onResetProgress }) => {
    
    // Pet evolution - baby, juvenile, mature
    const pets = [
        { baby: PinkEgg, juvenile: PinkKitten, mature: PinkCat },
        { baby: BlueEgg, juvenile: BlueKitten, mature: BlueCat },
        { baby: YellowEgg, juvenile: YellowKitten, mature: YellowCat },
    ];

    // Randomly select initial pet color
    const [currentPet, setCurrentPet] = useState(
        pets[Math.floor(Math.random() * pets.length)]
    );
    
    // Prevent multiple evolution timers
    const [isEvolutionComplete, setIsEvolveComplete] = useState(false);

    // Evolution stage thresholds
    const eggStageLimit = 3;        // 0-2 tasks: egg stage
    const juvenileStageLimit = 5;   // 3-7 tasks: kitten stage  
    const fullGrownStage = eggStageLimit + juvenileStageLimit; // 8+ tasks: adult stage

    // Select animation based on task progress
    const currentPetAnimation =
        taskForProgressBar >= fullGrownStage
            ? currentPet.mature     // Adult cat
            : taskForProgressBar >= eggStageLimit
            ? currentPet.juvenile   // Kitten
            : currentPet.baby;      // Egg

    // Calculate progress bar segments for current stage
    const currentStageLimit =
        taskForProgressBar < eggStageLimit
            ? eggStageLimit         // Show 3 segments for egg stage
            : taskForProgressBar < fullGrownStage
            ? juvenileStageLimit    // Show 5 segments for kitten stage
            : juvenileStageLimit;   // Show 5 segments for adult stage
    
    // Offset calculation for progress bar
    const currentStageOffset = taskForProgressBar < eggStageLimit ? 0 : eggStageLimit;

    // Progress bar styling
    const barWidth = 200;
    const rectangleWidth = barWidth / currentStageLimit;

    // Reset when pet reaches full evolution
    useEffect(() => {
        if (taskForProgressBar >= fullGrownStage && !isEvolutionComplete) {
            setIsEvolveComplete(true); // Lock to prevent multiple timers
            
            setTimeout(() => {
                setCurrentPet(pets[Math.floor(Math.random() * pets.length)]); // New random pet
                onResetProgress(); // Reset task counter to 0
                setIsEvolveComplete(false); // Unlock for next cycle
            }, 3000);
        }
    }, [taskForProgressBar, isEvolutionComplete, onResetProgress]);

    return (
        <div className="p-6 mx-auto bg-white rounded-xl shadow-lg">
            <div className="flex justify-between gap-5">
                
                {/* Pet animation display */}
                <div>
                    <Lottie
                        animationData={currentPetAnimation}
                        style={{ width: 50, height: 50 }}
                    />
                </div>

                {/* Progress bar */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "5px",
                            width: barWidth,
                            height: "20px",
                        }}
                    >
                        {Array.from({ length: currentStageLimit }).map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    width: rectangleWidth,
                                    height: "100%",
                                    borderRadius: "5px",
                                    // Green if completed, gray if not
                                    backgroundColor:
                                        index + currentStageOffset < taskForProgressBar
                                            ? "#84cc16"  // Completed
                                            : "#e5e7eb", // Incomplete
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetProgressBar;