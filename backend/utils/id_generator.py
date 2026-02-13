def next_id(prefix: str, existing: list[str]) -> str:
    # existing is like ['F_001','F_002']
    nums = []
    for i in existing:
        try:
            nums.append(int(i.split('_')[1]))
        except Exception:
            pass
    n = max(nums) + 1 if nums else 1
    return f"{prefix}_{str(n).zfill(3)}"
