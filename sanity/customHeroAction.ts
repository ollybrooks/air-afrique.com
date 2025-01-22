import { useDocumentOperation } from 'sanity';
import { useToast } from '@sanity/ui';

export const HeroPostAction = (props: any) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const toast = useToast();

  return {
    label: 'Set as Hero & Publish',
    onHandle: async () => {
      // Ensure the current post is set as Hero
      patch.execute([{ set: { hero: true } }]);

      // Unset `hero` field on other posts
      try {
        const query = `*[_type == "blogPost" && hero == true && _id != $id]`;
        const params = { id: props.id };
        const result = await props.client.fetch(query, params);

        const updates = result.map((doc: any) =>
          props.client.patch(doc._id).set({ hero: false }).commit()
        );

        await Promise.all(updates);
        publish.execute();

        toast.push({
          status: 'success',
          title: 'Hero post updated successfully!',
        });
      } catch (error: any) {
        toast.push({
          status: 'error',
          title: 'Failed to update Hero post',
          description: error.message,
        });
      }

      // Signal to Sanity Studio that the action is complete
      props.onComplete();
    },
  };
};