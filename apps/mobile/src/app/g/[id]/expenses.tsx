import { parseMajorToMinor } from '@circle/shared';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GroupScreen } from '@/components/GroupNav';
import { MemberPicker } from '@/components/MemberPicker';
import { Button, Card, Chip, Empty, Field, Loading, Muted, Row, Section, Segmented, Sheet, Txt, colors, useSheet } from '@/components/ui';
import { get, post } from '@/lib/api';
import { useAct, useGroup } from '@/lib/hooks';
import { useFormat } from '@/lib/prefs';

type SplitKind = 'equal' | 'exact' | 'shares';

export default function Expenses() {
  const { id, settle } = useLocalSearchParams<{ id: string; settle?: string }>();
  const g = useGroup(id);
  const { t } = useTranslation();
  const fmt = useFormat();
  const cur = g.group?.currency ?? 'EGP';
  const bal = useQuery({ queryKey: ['group', id, 'balances'], queryFn: () => get(`/groups/${id}/balances`) });
  const list = useQuery({ queryKey: ['group', id, 'expenses'], queryFn: () => get(`/groups/${id}/expenses`) });
  const { run, pending } = useAct(id);
  const add = useSheet();
  const pay = useSheet();
  const me = g.me?.userId;
  const [form, setForm] = useState({ title: '', amount: '', payerId: '', kind: 'equal' as SplitKind, members: [] as string[], values: {} as Record<string, string> });
  const [payment, setPayment] = useState({ toId: '', amount: '', method: 'cash' as 'cash' | 'bank' | 'wallet' | 'other' });

  useEffect(() => {
    if (g.members.length && !form.payerId) setForm((f) => ({ ...f, payerId: me ?? '', members: g.members.filter((m) => m.role !== 'child').map((m) => m.userId) }));
  }, [g.members.length]);
  const myDebts = (bal.data?.transfers ?? []).filter((x: any) => x.from === me);
  useEffect(() => {
    if (settle && myDebts[0]) {
      setPayment({ toId: myDebts[0].to, amount: String(myDebts[0].amount / 100), method: 'cash' });
      pay.show();
    }
  }, [settle, bal.data]);

  const total = parseMajorToMinor(form.amount) ?? 0;
  const exactSum = useMemo(() => Object.values(form.values).reduce((s, v) => s + (parseMajorToMinor(v) ?? 0), 0), [form.values]);
  const valid = form.title.trim() && total > 0 && form.payerId && (form.kind === 'equal' ? form.members.length > 0 : form.kind === 'exact' ? exactSum === total : Object.values(form.values).some((v) => Number(v) > 0));

  async function save() {
    const split =
      form.kind === 'equal'
        ? { kind: 'equal', members: form.members }
        : form.kind === 'exact'
          ? { kind: 'exact', amounts: Object.fromEntries(Object.entries(form.values).map(([k, v]) => [k, parseMajorToMinor(v) ?? 0]).filter(([, v]) => (v as number) > 0)) }
          : { kind: 'shares', shares: Object.fromEntries(Object.entries(form.values).map(([k, v]) => [k, Number(v) || 0]).filter(([, v]) => (v as number) > 0)) };
    await run(() => post(`/groups/${id}/expenses`, { title: form.title.trim(), amount: total, payerId: form.payerId, split }));
    setForm((f) => ({ ...f, title: '', amount: '', values: {} }));
    add.hide();
  }

  return (
    <GroupScreen id={id} active="expenses">
      {g.can('money.write') && (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <Button style={{ flex: 1 }} title={t('expenses.new')} onPress={add.show} testID="new-expense" color={g.group?.color} />
          <Button style={{ flex: 1 }} kind="secondary" title={t('expenses.recordPayment')} onPress={() => (setPayment({ toId: myDebts[0]?.to ?? '', amount: myDebts[0] ? String(myDebts[0].amount / 100) : '', method: 'cash' }), pay.show())} testID="record-payment" />
        </View>
      )}
      {bal.isLoading && <Loading />}
      {bal.data && (
        <Section title={t('expenses.simplified')}>
          <Card testID="balances-card">
            {bal.data.transfers.length === 0 && <Txt>{t('expenses.allSettled')}</Txt>}
            {bal.data.transfers.map((x: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, gap: 8 }}>
                <Txt style={{ flex: 1, fontWeight: x.from === me || x.to === me ? '700' : '400', color: x.from === me ? colors.danger : x.to === me ? colors.good : colors.text }}>
                  {t('expenses.owes', { from: x.from === me ? t('common.you') : g.memberName(x.from), to: x.to === me ? t('common.you') : g.memberName(x.to) })}
                </Txt>
                <Txt style={{ fontWeight: '700' }}>{fmt.money(x.amount, cur)}</Txt>
                {x.from === me && <Button small title={t('expenses.settleUp')} onPress={() => (setPayment({ toId: x.to, amount: String(x.amount / 100), method: 'cash' }), pay.show())} testID={`settle-${x.to}`} />}
              </View>
            ))}
          </Card>
        </Section>
      )}
      {bal.data?.pending?.length > 0 && (
        <Section title={t('expenses.pending')}>
          {bal.data.pending.map((s: any) => (
            <Card key={s.id} testID={`pending-${s.id}`}>
              <Txt>
                {g.memberName(s.fromId)} → {g.memberName(s.toId)} · {fmt.money(s.amountMinor, cur)} · {t(`expenses.${s.method}`)}
              </Txt>
              {s.toId === me && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <Button small title={t('common.confirm')} onPress={() => run(() => post(`/groups/${id}/settlements/${s.id}/confirm`))} testID={`confirm-${s.id}`} />
                  <Button small kind="secondary" title={t('common.reject')} onPress={() => run(() => post(`/groups/${id}/settlements/${s.id}/reject`))} />
                </View>
              )}
            </Card>
          ))}
        </Section>
      )}
      <Section title={t('expenses.history')}>
        {list.data?.length === 0 && <Empty title={t('group.nothingYet')} />}
        {list.data?.map((e: any) => (
          <Card key={e.id} style={{ paddingVertical: 4, opacity: e.reversedAt ? 0.5 : 1 }} testID={`expense-${e.id}`}>
            <Row
              title={e.title}
              strike={!!e.reversedAt}
              subtitle={`${t('expenses.paidBy')} ${g.memberName(e.payerId)} · ${fmt.date(e.spentAt)}${e.reversedAt ? ` · ${t('expenses.reversed')}` : ''}`}
              right={<Txt style={{ fontWeight: '700' }}>{fmt.money(e.amountMinor, cur)}</Txt>}
            />
          </Card>
        ))}
      </Section>

      <Sheet visible={add.open} onClose={add.hide} title={t('expenses.new')} testID="expense-sheet">
        <Field label={t('expenses.title')} value={form.title} onChangeText={(s) => setForm({ ...form, title: s })} testID="expense-title" />
        <Field label={`${t('expenses.amount')} (${cur})`} value={form.amount} onChangeText={(s) => setForm({ ...form, amount: s })} inputMode="decimal" testID="expense-amount" />
        <MemberPicker label={t('expenses.paidBy')} members={g.members} selected={[form.payerId]} onToggle={(u) => setForm({ ...form, payerId: u })} color={g.group?.color} />
        <Segmented<SplitKind> value={form.kind} onChange={(k) => setForm({ ...form, kind: k, values: {} })} options={[{ value: 'equal', label: t('expenses.equal') }, { value: 'exact', label: t('expenses.exact') }, { value: 'shares', label: t('expenses.shares') }]} />
        {form.kind === 'equal' ? (
          <MemberPicker members={g.members} selected={form.members} multi onToggle={(u) => setForm({ ...form, members: form.members.includes(u) ? form.members.filter((x) => x !== u) : [...form.members, u] })} color={g.group?.color} />
        ) : (
          g.members.map((m) => (
            <View key={m.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Txt style={{ flex: 1 }}>{m.displayName}</Txt>
              <View style={{ width: 120 }}>
                <Field value={form.values[m.userId] ?? ''} onChangeText={(s) => setForm({ ...form, values: { ...form.values, [m.userId]: s } })} inputMode="decimal" placeholder={form.kind === 'shares' ? '1' : '0'} />
              </View>
            </View>
          ))
        )}
        {form.kind === 'exact' && total > 0 && exactSum !== total && <Muted style={{ color: colors.warn, marginBottom: 8 }}>{t('expenses.remaining', { amount: fmt.money(total - exactSum, cur) })}</Muted>}
        <Button title={t('common.save')} onPress={save} disabled={!valid} loading={pending} testID="expense-save" color={g.group?.color} />
      </Sheet>

      <Sheet visible={pay.open} onClose={pay.hide} title={t('expenses.recordPayment')} testID="payment-sheet">
        <MemberPicker label={t('expenses.payTo')} members={g.members.filter((m) => m.userId !== me)} selected={[payment.toId]} onToggle={(u) => setPayment({ ...payment, toId: u })} color={g.group?.color} />
        <Field label={`${t('expenses.amount')} (${cur})`} value={payment.amount} onChangeText={(s) => setPayment({ ...payment, amount: s })} inputMode="decimal" testID="payment-amount" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {(['cash', 'bank', 'wallet', 'other'] as const).map((m) => (
            <Chip key={m} label={t(`expenses.${m}`)} active={payment.method === m} onPress={() => setPayment({ ...payment, method: m })} />
          ))}
        </View>
        <Muted style={{ marginBottom: 12 }}>{t('expenses.pending')}</Muted>
        <Button
          title={t('common.save')}
          disabled={!payment.toId || !parseMajorToMinor(payment.amount)}
          loading={pending}
          testID="payment-save"
          onPress={async () => {
            await run(() => post(`/groups/${id}/settlements`, { toId: payment.toId, amount: parseMajorToMinor(payment.amount), method: payment.method }));
            pay.hide();
          }}
        />
      </Sheet>
    </GroupScreen>
  );
}
