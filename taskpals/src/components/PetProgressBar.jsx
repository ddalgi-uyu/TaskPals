'use client';

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

import PinkEgg from "../assets/egg_pink_2.json";
import PinkKitten from "../assets/kitten_pink_2.json";
import PinkCat from "../assets/cat_pink_2.json";
import BlueEgg from "../assets/egg_blue_2.json";
import BlueKitten from "../assets/kitten_blue_2.json";
import BlueCat from "../assets/cat_blue_2.json";
import YellowEgg from "../assets/egg_yellow_2.json";
import YellowKitten from "../assets/kitten_yellow_2.json";
import YellowCat from "../assets/cat_yellow_2.json";

const STORAGE_KEY = 'currentPetIndex';

const PetProgressBar = ({ taskForProgressBar, onResetProgress }) => {
    
    // Pet evolution - baby, juvenile, mature
    const pets = [
        { baby: PinkEgg, juvenile: PinkKitten, mature: PinkCat, name: 'Pink' },
        { baby: BlueEgg, juvenile: BlueKitten, mature: BlueCat, name: 'Blue' },
        { baby: YellowEgg, juvenile: YellowKitten, mature: YellowCat, name: 'Yellow' },
    ];

    // State to track if data is loaded from localStorage
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentPetIndex, setCurrentPetIndex] = useState(null);
    const [isEvolutionComplete, setIsEvolveComplete] = useState(false);

    const eggStageLimit = 3;
    const juvenileStageLimit = 5;
    const fullGrownStage = eggStageLimit + juvenileStageLimit;

    // Load pet from localStorage on mount
    useEffect(() => {
        try {
            const savedPetIndex = localStorage.getItem(STORAGE_KEY);
            
            if (savedPetIndex !== null) {
                setCurrentPetIndex(parseInt(savedPetIndex, 10));
            } else {
                const randomIndex = Math.floor(Math.random() * pets.length);
                setCurrentPetIndex(randomIndex);
                localStorage.setItem(STORAGE_KEY, randomIndex.toString());
            }
        } catch (error) {
            console.error('Error loading pet from localStorage:', error);
            setCurrentPetIndex(Math.floor(Math.random() * pets.length));
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save pet to localStorage when it changes
    useEffect(() => {
        if (isLoaded && currentPetIndex !== null) {
            try {
                localStorage.setItem(STORAGE_KEY, currentPetIndex.toString());
            } catch (error) {
                console.error('Error saving pet to localStorage:', error);
            }
        }
    }, [currentPetIndex, isLoaded]);

    // Reset when pet reaches full evolution
    useEffect(() => {
        if (taskForProgressBar >= fullGrownStage && !isEvolutionComplete && isLoaded) {
            setIsEvolveComplete(true);
            
            const timer = setTimeout(() => {
                const newPetIndex = Math.floor(Math.random() * pets.length);
                setCurrentPetIndex(newPetIndex);
                onResetProgress();
                setIsEvolveComplete(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [taskForProgressBar, isEvolutionComplete, onResetProgress, fullGrownStage, isLoaded, pets.length]);

    // Don't render until pet is loaded
    if (!isLoaded || currentPetIndex === null) {
        return (
            <div className="p-6 mx-auto bg-white rounded-xl shadow-lg">
                <div className="flex justify-center items-center h-16">
                    <p className="text-gray-400">Loading pet...</p>
                </div>
            </div>
        );
    }

    const currentPet = pets[currentPetIndex];

    // Select animation based on task progress
    const currentPetAnimation =
        taskForProgressBar >= fullGrownStage
            ? currentPet.mature
            : taskForProgressBar >= eggStageLimit
            ? currentPet.juvenile
            : currentPet.baby;

    // Calculate progress bar segments for current stage
    const currentStageLimit =
        taskForProgressBar < eggStageLimit
            ? eggStageLimit
            : taskForProgressBar < fullGrownStage
            ? juvenileStageLimit
            : juvenileStageLimit;
    
    const currentStageOffset = taskForProgressBar < eggStageLimit ? 0 : eggStageLimit;

    // Progress bar styling
    const barWidth = 200;
    const rectangleWidth = barWidth / currentStageLimit;

    return (
        <div className="p-6 mx-auto bg-white rounded-xl shadow-lg">
            <div className="flex justify-between gap-5">
                
                {/* Pet animation display */}
                <div className="relative">
                    <Lottie
                        animationData={currentPetAnimation}
                        style={{ width: 50, height: 50 }}
                    />
                    {/* Show pet color name */}
                    <div className="text-xs text-center text-gray-500 mt-1">
                        {currentPet.name}
                    </div>
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
                                    backgroundColor:
                                        index + currentStageOffset < taskForProgressBar
                                            ? "#84cc16"
                                            : "#e5e7eb",
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