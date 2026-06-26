## React.js

React는 **컴포넌트 기반**으로 UI를 만드는 가장 널리 쓰이는 프론트엔드 라이브러리입니다.
화면을 작은 조각(컴포넌트)으로 나누고, 상태(state)에 따라 화면이 자동으로 갱신됩니다.

### 핵심 개념

- **컴포넌트**: UI를 재사용 가능한 함수 단위로 분리
- **Props / State**: 데이터를 받아 그리고(props), 내부 상태로 변화 관리(state)
- **Hooks**: `useState`, `useEffect` 등으로 로직 재사용

### 간단 예시

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 수: {count}
    </button>
  );
}
```

> 프레임워크는 하나를 골라 깊게 익히는 것이 중요합니다.
