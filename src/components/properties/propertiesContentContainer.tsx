"use client";
import PropertiesContentContainer from "./propertiesCardItem";

const PropertiesContainer = () => {
    return (
        <>
            {/* removed class name propertyContentContainer, as it does not exist on the globals.css */}
            <section>
                <PropertiesContentContainer  />
            </section> 
        </>
    );
};

export default PropertiesContainer;
