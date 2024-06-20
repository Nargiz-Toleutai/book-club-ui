import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Book } from "./BookList";
import { z } from "zod";

export interface BookProgress {
  id: number;
  bookId: number;
  userId: number;
  pageProgress: number;
  book?: Book;
}

export const ProgressDataValidator = z
  .object({
    id: z.preprocess((val) => Number(val), z.number().int().positive()),
    pageProgress: z.preprocess((val) => Number(val), z.number().positive()),
  })
  .strict();

export type Progress = z.infer<typeof ProgressDataValidator>;

interface ProgressFormProps {
  onSubmit: (formData: Progress) => void;
  progress: BookProgress;
}

const ProgressForm = ({ onSubmit, progress }: ProgressFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Progress>({
    resolver: zodResolver(ProgressDataValidator),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="number"
        id={`change-pageProgress-${progress.id}`}
        className={`${errors.pageProgress ? "error-input" : ""}`}
        defaultValue={progress.pageProgress}
        min="0"
        max={progress.book?.pageCount}
        {...register("pageProgress")}
      />
      <input hidden value={progress.id} {...register("id")} />
      {errors.pageProgress && (
        <p className="error-message">{errors.pageProgress.message}</p>
      )}
      <button type="submit">Update Progress</button>
    </form>
  );
};

export default ProgressForm;
