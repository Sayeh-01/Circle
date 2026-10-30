import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Field, Loading, Muted, Screen, Txt } from '@/components/ui';
import { del, get, patch } from '@/lib/api';
import { confirmAsk, useAct, useGroup } from '@/lib/hooks';

export default function Page() {
  const { id, pageId, edit } = useLocalSearchParams<{ id: string; pageId: string; edit?: string }>();
  const g = useGroup(id);
  const { t } = useTranslation();
  const router = useRouter();
  const { run, pending } = useAct(id);
  const q = useQuery({ queryKey: ['group', id, 'page', pageId], queryFn: () => get(`/groups/${id}/pages/${pageId}`) });
  const [editing, setEditing] = useState(!!edit);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  useEffect(() => {
    if (q.data) {
      setTitle(q.data.title);
      setBody(q.data.body);
    }
  }, [q.data?.updatedAt]);
  if (q.isLoading || !q.data) return <Screen title="" back><Loading /></Screen>;
  return (
    <Screen title={q.data.title} back accent={g.group?.color} testID="page-screen" right={g.can('items.create') && !editing ? <Button small kind="ghost" title={t('common.edit')} onPress={() => setEditing(true)} testID="page-edit" /> : null}>
      {editing ? (
        <>
          <Field label={t('study.pageTitle')} value={title} onChangeText={setTitle} testID="page-title" />
          <Field label={t('study.pageBody')} value={body} onChangeText={setBody} multiline style={{ minHeight: 260 }} testID="page-body" />
          <Button
            title={t('common.save')}
            loading={pending}
            color={g.group?.color}
            testID="page-save"
            onPress={async () => {
              await run(() => patch(`/groups/${id}/pages/${pageId}`, { title: title.trim() || q.data.title, body }));
              setEditing(false);
            }}
          />
          <Button
            kind="ghost"
            title={t('common.delete')}
            onPress={async () => {
              if (!(await confirmAsk(t('common.delete')))) return;
              await run(() => del(`/groups/${id}/pages/${pageId}`));
              router.back();
            }}
          />
        </>
      ) : (
        <Card>
          <Txt style={{ fontSize: 16, lineHeight: 24 }}>{q.data.body || '—'}</Txt>
          <Muted style={{ marginTop: 12 }}>{t('study.edited', { name: g.memberName(q.data.updatedBy) })}</Muted>
        </Card>
      )}
    </Screen>
  );
}
