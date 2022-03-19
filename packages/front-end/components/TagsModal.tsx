import { useForm } from "react-hook-form";
import { useAuth } from "./../services/auth";
import Modal from "./Modal";
import Field from "./Forms/Field";
import { HexColorPicker } from "react-colorful";
import styles from "./TagsModal.module.scss";
import React from "react";
import Tag from "./Tag";

export default function TagsModal({
  existing,
  close,
  onSuccess,
}: {
  existing: Partial<{ name: string; color: string; description: string }>;
  close: () => void;
  onSuccess: () => Promise<void>;
}) {
  const form = useForm<{ name: string; color: string; description: string }>({
    defaultValues: {
      name: existing?.name || "",
      color: existing?.color || null,
      description: existing?.description || "",
    },
  });
  const { apiCall } = useAuth();

  const tagColors = [
    { value: "#029dd1", label: "light-blue" },
    { value: "#0047bd", label: "blue" },
    { value: "#F170AC", label: "pink" },
    { value: "#D64538", label: "red" },
    { value: "#fc8414", label: "orange" },
    { value: "#e2d221", label: "yellow" },
    { value: "#99d560", label: "lime" },
    { value: "#28A66B", label: "green" },
    { value: "#20C9B9", label: "teal" },
  ];

  return (
    <Modal
      open={true}
      close={close}
      header={existing?.name ? "Edit Tag" : "Create Tag"}
      submit={form.handleSubmit(async (value) => {
        await apiCall(existing.name ? `/tag/${existing.name}` : `/tag`, {
          method: existing.name ? "PUT" : "POST",
          body: JSON.stringify(value),
        });
        await onSuccess();
      })}
    >
      <div className="colorpicker tagmodal">
        <div className="row mb-3">
          <div className="col">
            <Field
              name="Name"
              label="Name"
              readOnly={!!existing?.name}
              maxLength={30}
              className=""
              required
              {...form.register("name")}
            />
          </div>
        </div>
        <label>Color:</label>
        <div className={styles.picker}>
          <HexColorPicker
            onChange={(c) => {
              form.setValue("color", c);
            }}
            style={{ margin: "0 auto" }}
            color={form.watch("color") || ""}
            id="tagcolor"
          />
          <div className={styles.picker__swatches}>
            {tagColors.map((c) => (
              <button
                key={c.value}
                className={styles.picker__swatch}
                style={{ background: c.value }}
                onClick={(e) => {
                  e.preventDefault();
                  form.setValue("color", c.value);
                }}
              />
            ))}
          </div>
        </div>
        <Field
          name="Name"
          label="Description"
          textarea
          maxLength={30}
          {...form.register("description")}
        />
        <div className="text-center px-4">
          <label>Preview</label>
          <div>
            <Tag tag={form.watch("name")} color={form.watch("color")} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
