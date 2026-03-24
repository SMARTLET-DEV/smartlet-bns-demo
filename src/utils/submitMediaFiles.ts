import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useUpdatePropertyMutation } from "@/redux/reducers/property/propertyApi";
import { setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { normalizePropertyResponse } from "@/utils/property"; // ✅ import

export function useUploadPropertyMedia() {
    const [updateProperty] = useUpdatePropertyMutation();
    const createdProperty = useAppSelector((state) => state.property.createdProperty);
    const dispatch = useAppDispatch();

    const submitMediaFiles = async (sectionFiles: Record<string, File[] | string>) => {
        if (!createdProperty?.id) {
            console.warn("⛔ No property ID found. Cannot upload media.");
            return false;
        }

        const formData = new FormData();

        Object.entries(sectionFiles).forEach(([key, value]) => {
            if (typeof value === "string") {
                if (value.trim()) {
                    formData.append(key, value);
                    console.log(`🔗 Appending link field: ${key} = ${value}`);
                }
            } else if (Array.isArray(value)) {
                if (typeof value[0] === "string") {
                    // ✅ Append each tag string individually
                    value.forEach((tag) => {
                        formData.append("tags[]", tag);
                        console.log(`🏷️ Appending tag: ${tag}`);
                    });
                } else {
                    // ✅ Handle File[] uploads
                    value.forEach((file) => {
                        const normalizedKey =
              key.startsWith("floor-")
                  ? "layout"
                  : key === "hiResImages"
                      ? "media"
                      : key === "thumbnail"
                          ? "thumbnail"
                          : key;

                        formData.append(normalizedKey, file);
                        console.log(`📎 Appending file: ${normalizedKey} => ${file.name}`);
                    });
                }
            }
        });


        //formData.append("title", createdProperty.title || "Updated Title");

        try {
            console.log("🚀 Uploading to updateProperty API...");
            //console.log("📦 FormData contents:", Array.from(formData.entries()));
            const response = await updateProperty({
                id: createdProperty.id,
                data: formData,
            }).unwrap();

            if (response?.success && response?.property) {
                const normalized = normalizePropertyResponse(response.property); // ✅ normalize first
                dispatch(setCreatedProperty(normalized)); // ✅ consistent Redux structure
                console.log("🧠 Updated property dispatched to Redux");
            }

            return true;
        } catch (error) {
            console.error("❌ Media upload failed:", error);
            return false;
        }
    };

    return { submitMediaFiles };
}
